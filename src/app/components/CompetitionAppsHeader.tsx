import { ChevronLeft } from 'lucide-react';
import svgPaths from "@/imports/svg-sverjcyarl";

export function CompetitionAppsHeader() {
  return (
    <div className="flex items-center gap-6 mb-8">
      <button 
        className="flex items-center justify-center w-7 h-7 hover:bg-gray-100 rounded transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6 text-[#0F2744]" />
      </button>
      
      <div className="flex items-center gap-7">
        <div className="bg-[#418afe] border border-[#95b5fe] rounded-sm w-9 h-9 relative overflow-hidden">
          <div className="absolute inset-[10.94%_3.12%_15.63%_3.13%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.7501 26.4375">
              <g>
                <path d={svgPaths.p303deb00} fill="#84B7F9" />
                <path d={svgPaths.p33491800} fill="#94C1FA" />
                <path d={svgPaths.pd67dfc0} fill="#64A5F8" />
                <path d={svgPaths.p3ed0800} fill="#64A5F8" />
                <path d={svgPaths.pddeb1c0} fill="#ED576B" />
                <path d={svgPaths.p33ee02c0} fill="#EE6A79" />
                <path d={svgPaths.p306e4a80} fill="#EB445C" />
                <path d={svgPaths.p2eb23800} fill="#EB445C" />
                <path d={svgPaths.p87d5e80} fill="#FFD452" />
                <path d={svgPaths.p362b5400} fill="#F5B953" />
                <path d={svgPaths.p2b096a80} fill="#F8CD82" />
                <path d={svgPaths.p296f01f0} fill="#F5B953" />
                <path d={svgPaths.pf0df200} fill="#F8CD82" />
                <path d={svgPaths.p32812180} fill="#F5B953" />
                <path d={svgPaths.p17c82f70} fill="#F8CD82" />
                <path d={svgPaths.p24247000} fill="#F5B953" />
                <path d={svgPaths.p711d2f0} fill="#F8CD82" />
              </g>
            </svg>
          </div>
        </div>
        
        <h1 className="font-['Inter'] font-medium text-[28px] leading-[48px] tracking-[-0.308px] text-black">
          Competition
        </h1>
      </div>
    </div>
  );
}
