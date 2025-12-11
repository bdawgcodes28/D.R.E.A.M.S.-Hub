import React from 'react'
import { COLORS_CONSTANTS } from '../../styles/StyleConstants'

export default function Testimonal() {
    return (
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <p
          className={`text-center mx-auto h-12 text-[${COLORS_CONSTANTS.DREAMS_PINK}]`}
          style={{color: COLORS_CONSTANTS.DREAMS_PINK, fontWeight:'bold'}}
          >Words from our community.</p>

          <figure className="mt-10">
            <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
              <p>
              “Volunteering with D.R.E.A.M.S Collective has been inspiring 
              and rewarding, giving me the chance to support youth and share 
              the excitement of STEM.”
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                alt=""
                src="https://dreams-media-a.s3.us-east-2.amazonaws.com/user-media/undergraduates/Lopes%2C+Elias+TM126021624-098.jpg"
                className="mx-auto size-10 rounded-full object-cover"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900 mr-[10px]">Elias Lopes</div>
                <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="ml-[10px] text-gray-600">Honors Student at North Carolina A&T</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    )
  }
  