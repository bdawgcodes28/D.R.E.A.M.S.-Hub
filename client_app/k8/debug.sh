#!/bin/bash

echo "=== Checking Pod Status ==="
kubectl get pods -l app=dreams-website-deployment

echo -e "\n=== Checking Pod Details ==="
kubectl get pods -l app=dreams-website-deployment -o wide

echo -e "\n=== Checking Service ==="
kubectl get svc frontend-service

echo -e "\n=== Checking Service Endpoints ==="
kubectl get endpoints frontend-service

echo -e "\n=== Recent Pod Logs (last 50 lines) ==="
POD_NAME=$(kubectl get pods -l app=dreams-website-deployment -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ ! -z "$POD_NAME" ]; then
    echo "Pod: $POD_NAME"
    kubectl logs $POD_NAME --tail=50
else
    echo "No pods found!"
fi

echo -e "\n=== Pod Events ==="
if [ ! -z "$POD_NAME" ]; then
    kubectl describe pod $POD_NAME | grep -A 20 "Events:"
fi

echo -e "\n=== Testing Internal Connectivity ==="
if [ ! -z "$POD_NAME" ]; then
    echo "Testing if app responds inside pod..."
    kubectl exec $POD_NAME -- wget -qO- http://localhost:3000 || echo "Failed to connect to app on port 3000"
fi

echo -e "\n=== ConfigMap Values ==="
kubectl get configmap dreams-app-config -o yaml | grep -A 10 "data:"
