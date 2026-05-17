"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, BookMarked, ChevronRight, X, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getCollections, createCollection, deleteCollection, removeFromCollection, type Collection } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const EMOJIS = ['📚', '🌙', '⭐', '🕌', '🤲', '💎', '🌿', '🔥', '✨', '❤️'];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('📚');
  const { toast } = useToast();

  useEffect(() => {
    setCollections(getCollections());
  }, []);

  const refresh = () => {
    const all = getCollections();
    setCollections(all);
    if (selectedCollection) {
      const updated = all.find(c => c.id === selectedCollection.id);
      setSelectedCollection(updated || null);
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createCollection(newName.trim(), newEmoji);
    setNewName('');
    setNewEmoji('📚');
    setShowCreate(false);
    refresh();
    toast({ title: 'Collection créée !', description: `"${newName}" est prête.` });
  };

  const handleDelete = (id: string, name: string) => {
    deleteCollection(id);
    if (selectedCollection?.id === id) setSelectedCollection(null);
    refresh();
    toast({ title: 'Collection supprimée', description: `"${name}" a été supprimée.` });
  };

  const handleRemoveItem = (hikmaFr: string) => {
    if (!selectedCollection) return;
    removeFromCollection(selectedCollection.id, hikmaFr);
    refresh();
  };

  if (selectedCollection) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-32">
        <header className="pt-8 flex items-center gap-3">
          <button onClick={() => setSelectedCollection(null)} className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {selectedCollection.emoji} {selectedCollection.name}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedCollection.items.length} hikma(s)</p>
          </div>
        </header>

        <AnimatePresence mode="popLayout">
          {selectedCollection.items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 border-2 border-dashed border-muted rounded-3xl">
              <FolderOpen className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">Cette collection est vide.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Ajoutez des hikmas depuis l'écran principal.</p>
            </motion.div>
          ) : (
            selectedCollection.items.map((hikma, i) => (
              <motion.div key={hikma.fr} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-none shadow-md rounded-3xl bg-white/80 dark:bg-slate-900/80">
                  <CardContent className="p-5 flex gap-4 items-start">
                    <div className="flex-1 space-y-1">
                      {hikma.arabe && <p className="text-purple-500 font-arabic text-base leading-loose" dir="rtl">{hikma.arabe}</p>}
                      <p className="text-slate-700 dark:text-slate-200 text-sm font-medium leading-relaxed">{hikma.fr}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{hikma.source}</p>
                    </div>
                    <button onClick={() => handleRemoveItem(hikma.fr)}
                      className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-32">
      <header className="flex items-center justify-between pt-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Mes <span className="text-purple-400">Collections</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Organisez vos hikmas par thème</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="rounded-full bg-purple-500 hover:bg-purple-600 gap-2">
          <Plus className="w-4 h-4" /> Nouvelle
        </Button>
      </header>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl border border-purple-100 dark:border-purple-800/30 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Nouvelle collection</h2>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-xl transition-all ${newEmoji === e ? 'bg-purple-100 dark:bg-purple-800/40 ring-2 ring-purple-400' : 'hover:bg-muted'}`}>
                  {e}
                </button>
              ))}
            </div>
            <Input placeholder="Nom de la collection (ex: Sabr, Gratitude...)"
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className="rounded-xl" />
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="flex-1 bg-purple-500 hover:bg-purple-600 rounded-xl">Créer</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">Annuler</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {collections.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 border-2 border-dashed border-muted rounded-3xl">
            <BookMarked className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Aucune collection</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Créez votre première collection thématique</p>
          </motion.div>
        ) : (
          collections.map((col, i) => (
            <motion.div key={col.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-none shadow-md hover:shadow-xl transition-all rounded-3xl bg-white/80 dark:bg-slate-900/80 cursor-pointer group"
                onClick={() => setSelectedCollection(col)}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {col.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">{col.name}</p>
                    <p className="text-sm text-muted-foreground">{col.items.length} hikma(s)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); handleDelete(col.id, col.name); }}
                      className="p-2 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-purple-400 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
