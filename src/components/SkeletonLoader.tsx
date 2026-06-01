import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'list' | 'hero';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'card', count = 3 }) => {
  const renderSkeleton = (index: number) => {
    if (type === 'hero') {
      return (
        <div key={index} className="w-full h-80 rounded-2xl glass-panel animate-pulse p-6 flex flex-col justify-between mb-8">
          <div className="flex justify-between items-start">
            <div className="h-6 w-32 bg-slate-800 rounded-md" />
            <div className="h-10 w-16 bg-slate-800 rounded-full" />
          </div>
          <div className="flex justify-center items-center space-x-12 my-6">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-16 w-16 bg-slate-800 rounded-full" />
              <div className="h-4 w-24 bg-slate-800 rounded" />
            </div>
            <div className="h-8 w-8 bg-slate-800 rounded-full" />
            <div className="flex flex-col items-center space-y-3">
              <div className="h-16 w-16 bg-slate-800 rounded-full" />
              <div className="h-4 w-24 bg-slate-800 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-slate-800 rounded" />
            <div className="h-4 w-1/2 bg-slate-800 rounded" />
          </div>
        </div>
      );
    }

    if (type === 'list') {
      return (
        <div key={index} className="w-full h-20 rounded-xl glass-panel animate-pulse p-4 flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-20 bg-slate-800 rounded-md" />
            <div className="h-4 w-32 bg-slate-800 rounded" />
          </div>
          <div className="flex items-center space-x-8">
            <div className="h-4 w-40 bg-slate-800 rounded" />
            <div className="h-8 w-12 bg-slate-800 rounded-full" />
          </div>
        </div>
      );
    }

    // Default 'card'
    return (
      <div key={index} className="rounded-xl glass-panel animate-pulse p-5 flex flex-col justify-between h-[360px]">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 w-24 bg-slate-800 rounded" />
            <div className="h-8 w-10 bg-slate-800 rounded-full" />
          </div>
          <div className="flex justify-between items-center my-6">
            <div className="flex flex-col items-center space-y-2 w-5/12">
              <div className="h-12 w-12 bg-slate-800 rounded-full" />
              <div className="h-3 w-16 bg-slate-800 rounded" />
            </div>
            <div className="h-4 w-6 bg-slate-800 rounded" />
            <div className="flex flex-col items-center space-y-2 w-5/12">
              <div className="h-12 w-12 bg-slate-800 rounded-full" />
              <div className="h-3 w-16 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="h-3 w-full bg-slate-800 rounded" />
          <div className="h-3 w-4/5 bg-slate-800 rounded" />
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
          <div className="h-8 w-24 bg-slate-800 rounded-md" />
          <div className="h-8 w-24 bg-slate-800 rounded-md" />
        </div>
      </div>
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
};

export default SkeletonLoader;
