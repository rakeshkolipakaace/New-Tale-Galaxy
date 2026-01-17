import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { genres, ageGroups } from "@/lib/storyData";
import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [selectedAge, setSelectedAge] = useState<string>("3-5");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col relative overflow-auto">
      
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-4"
          >
            {/* Left Spacer for balance */}
            <div className="w-32 hidden sm:block" />
            
            {/* Center Logo */}
            <div className="flex items-center justify-center gap-2">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-blue-600 uppercase">
                StoryTime
              </span>
            </div>
            
            {/* Right Side - Age Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">Age:</span>
              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger 
                  className="w-32 bg-white border-blue-200 hover:border-blue-300 transition-colors"
                  data-testid="select-age"
                >
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((age) => (
                    <SelectItem 
                      key={age.value} 
                      value={age.value}
                      data-testid={`age-option-${age.value}`}
                    >
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          {/* Main Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-story font-bold text-slate-800 leading-tight mb-2">
              Choose your
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-story font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 leading-tight">
              Adventure
            </h1>
          </motion.div>
        </div>
      </header>

      {/* Genre Cards Grid */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            <Link href={`/book/all?age=${selectedAge}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="link-view-all-stories"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-story text-xl py-8 px-12 rounded-2xl shadow-xl shadow-blue-500/20 group">
                  <BookOpen className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Explore All Stories
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
