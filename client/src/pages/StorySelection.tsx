import { useRoute, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { stories, genres, ageGroups } from "@/lib/storyData";
import { ChevronLeft, BookOpen, Clock, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

export default function StorySelection() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  
  // Get age from URL query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const selectedAge = searchParams.get('age') || '3-5';
  
  // Flatten all stories and add their genre for filtering
  const allStories = useMemo(() => {
    return Object.entries(stories).flatMap(([genreId, storyList]) => 
      storyList.map(story => ({ ...story, genreId }))
    );
  }, []);

  const filteredStories = useMemo(() => {
    return allStories.filter(story => {
      const matchesAge = story.ageGroup === selectedAge;
      const matchesGenre = selectedGenre === "all" || story.genreId === selectedGenre;
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAge && matchesGenre && matchesSearch;
    });
  }, [allStories, selectedAge, selectedGenre, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col relative overflow-auto">
      
      {/* Header */}
      <div className="pt-8 pb-8 px-6 sm:px-8 border-b border-slate-800 z-10 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              className="rounded-full w-10 h-10 p-0 hover:bg-slate-800 text-slate-400" 
              onClick={() => setLocation('/')}
              data-testid="button-back"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-3xl font-story font-bold text-white">Stories for {selectedAge}</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search stories..."
                className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Story Grid */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, index) => (
              <Link key={story.id} href={`/read/${story.genreId}/${story.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`story-card-${story.id}`}
                >
                  <Card className="overflow-hidden border-slate-800 shadow-xl transition-all duration-300 group cursor-pointer bg-slate-900 h-full border-2 hover:border-blue-500/50">
                    <CardContent className="p-0">
                      {/* Cover Image */}
                      <div className="w-full aspect-[4/3] overflow-hidden bg-slate-800 relative">
                        <img 
                          src={story.coverImage} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                          alt={story.title}
                        />
                        {/* Tag */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/20">
                            Tag : {genres.find(g => g.id === story.genreId)?.title || 'Action'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-story font-bold text-xl text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                          {story.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                          {story.description}
                        </p>
                        
                        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>5 min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span>4.8</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            Read Now
                            <BookOpen className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
          
          {filteredStories.length === 0 && (
            <div className="text-center py-24 bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
              <p className="text-slate-500 text-lg">No stories match your search or filters.</p>
              <Button 
                variant="link" 
                className="mt-2 text-blue-400"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
