#!/bin/bash

# Deployment script for dreams-website
# Builds Docker image, pushes to ECR, and restarts Kubernetes deployment

set -e  # Exit on error

# Configuration
IMAGE_NAME="534804646908.dkr.ecr.us-east-2.amazonaws.com/dreams-website:latest"
REGION="us-east-2"
DEPLOYMENT_NAME="dreams-website-deployment"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "========================================="
echo "Dreams Website Deployment Script"
echo "========================================="
echo ""

# Step 1: Build Docker image for linux/amd64 (required for EKS)
echo "Step 1: Building Docker image for linux/amd64..."
cd "$PROJECT_ROOT"
docker build --platform linux/amd64 -t "$IMAGE_NAME" .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi
echo "✅ Docker image built successfully"
echo ""

# Step 2: Login to ECR
echo "Step 2: Logging into AWS ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$(echo $IMAGE_NAME | cut -d'/' -f1)"

if [ $? -ne 0 ]; then
    echo "❌ ECR login failed!"
    exit 1
fi
echo "✅ Logged into ECR successfully"
echo ""

# Step 3: Push image to ECR
echo "Step 3: Pushing image to ECR..."
docker push "$IMAGE_NAME"

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed!"
    exit 1
fi
echo "✅ Image pushed to ECR successfully"
echo ""

# Step 4: Get current replica count and scale down if needed (for resource-constrained clusters)
echo "Step 4: Preparing for deployment update..."
CURRENT_REPLICAS=$(kubectl get deployment "$DEPLOYMENT_NAME" -o jsonpath='{.spec.replicas}')
echo "Current replicas: $CURRENT_REPLICAS"

# If we have multiple replicas and cluster is resource-constrained, scale down first
if [ "$CURRENT_REPLICAS" -gt 1 ]; then
    echo "Temporarily scaling down to 1 replica to free resources..."
    kubectl scale deployment/"$DEPLOYMENT_NAME" --replicas=1
    sleep 5  # Wait for scale down to complete
fi

# Step 5: Restart Kubernetes deployment
echo "Step 5: Restarting Kubernetes deployment..."
kubectl rollout restart deployment/"$DEPLOYMENT_NAME"

if [ $? -ne 0 ]; then
    echo "❌ Failed to restart deployment!"
    exit 1
fi
echo "✅ Deployment restart initiated"
echo ""

# Step 6: Wait for rollout to complete
echo "Step 6: Waiting for rollout to complete..."
kubectl rollout status deployment/"$DEPLOYMENT_NAME" --timeout=300s

if [ $? -ne 0 ]; then
    echo "⚠️  Rollout may still be in progress. Check with: kubectl get pods -l app=$DEPLOYMENT_NAME"
    exit 1
fi
echo "✅ Rollout completed successfully"
echo ""

# Step 7: Scale back up if we scaled down
if [ "$CURRENT_REPLICAS" -gt 1 ]; then
    echo "Step 7: Scaling back up to $CURRENT_REPLICAS replicas..."
    kubectl scale deployment/"$DEPLOYMENT_NAME" --replicas="$CURRENT_REPLICAS"
    sleep 10  # Wait for new pods to start
fi

# Step 8: Show pod status
echo "Step 8: Current pod status:"
kubectl get pods -l app="$DEPLOYMENT_NAME"
echo ""

echo "========================================="
echo "✅ Deployment completed successfully!"
echo "========================================="
echo ""
echo "To check logs: kubectl logs -l app=$DEPLOYMENT_NAME --tail=50 -f"
echo "To check service: kubectl get svc frontend-service"
