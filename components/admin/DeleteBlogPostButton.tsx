'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';

interface DeleteBlogPostButtonProps {
  postId: string;
  postTitle: string;
  onDelete: (postId: string) => void;
}

export function DeleteBlogPostButton({ postId, postTitle, onDelete }: DeleteBlogPostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/blog/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Грешка при изтриване');
      }

      onDelete(postId);
      setShowConfirm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Грешка при изтриване на статията');
    } finally {
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="glass-card p-6 max-w-md w-full mx-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-full bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-zinc-50 mb-2">
                Изтриване на статия
              </h3>
              <p className="text-sm text-zinc-400 mb-1">
                Сигурен ли си че искаш да изтриеш тази статия?
              </p>
              <p className="text-sm font-semibold text-zinc-300">
                "{postTitle}"
              </p>
              <p className="text-xs text-red-400 mt-2">
                Това действие е необратимо!
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Откажи
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Изтриване...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Изтрий
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 hover:bg-red-900/20 rounded-lg transition-colors"
      title="Изтрий"
    >
      <Trash2 className="w-4 h-4 text-red-400" />
    </button>
  );
}
