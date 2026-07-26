'use client';

import React, { useState } from 'react';
import { KnowledgeArticleDTO } from '@/types/customerOps';
import { Search, BookOpen, ThumbsUp, Eye, FileText } from 'lucide-react';

interface KnowledgeBaseWidgetProps {
  articles: KnowledgeArticleDTO[];
  onSearch: (query: string) => void;
}

export const KnowledgeBaseWidget: React.FC<KnowledgeBaseWidgetProps> = ({ articles, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticleDTO | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    onSearch(q);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Knowledge Base & Documentation</h3>
          <p className="text-xs text-slate-400 mt-1">
            Search tutorials, financial AI guides, and enterprise billing documentation.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search guides & articles..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {selectedArticle ? (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-xs font-semibold text-indigo-400 hover:underline"
          >
            ← Back to all articles
          </button>
          <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
          <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold uppercase">
              {selectedArticle.category}
            </span>
            <span>{selectedArticle.views} Views</span>
            <span>{selectedArticle.helpfulCount} Found Helpful</span>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed space-y-3">
            <p>{selectedArticle.content}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  {art.category}
                </span>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {art.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> {art.helpfulCount}
                  </span>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors">
                {art.title}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2">{art.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
