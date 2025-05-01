"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SnippetList } from "@/components/snippet-list";
import { ProfileSettings } from "@/components/profile-settings";
import { User } from "next-auth";
import { motion } from "framer-motion";

interface DashboardSnippetsProps {
  mySnippets: any[];
  likedSnippets: any[];
  user: User;
}

const tabVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

const headerStyles = {
  title: {
    textShadow: `0 0 20px rgba(0, 240, 255, 0.5),
                 0 0 40px rgba(0, 240, 255, 0.3),
                 0 0 60px rgba(0, 240, 255, 0.1)`
  }
};

export function DashboardSnippets({ mySnippets, likedSnippets, user }: DashboardSnippetsProps) {
  return (
    <Tabs defaultValue="my-snippets" className="space-y-6">
      <div className="relative">
        {/* Container for consistent height */}
        <div className="h-[56px] relative">
          <TabsList className="relative grid w-full grid-cols-3 bg-transparent h-full">
            {/* Structural bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#00f0ff]/10" />
            
            <TabsTrigger
              value="my-snippets"
              className="relative group h-full transition-colors duration-200
                data-[state=active]:text-[#00f0ff] text-[#8b95a8]
                hover:text-[#00f0ff]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                   style={{
                     boxShadow: '0 0 20px rgba(0, 240, 255, 0.07) inset'
                   }} />
              
              {/* Center alignment container */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <span className="font-orbitron tracking-wide text-center">
                  My Snippets
                </span>
              </div>

              {/* Active indicator line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-data-[state=active]:scale-x-100 
                            transition-transform duration-200 origin-center">
                <div className="h-full bg-[#00f0ff]" />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#00f0ff] blur-[2px]" />
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="liked-snippets"
              className="relative group h-full transition-colors duration-200
                data-[state=active]:text-[#00f0ff] text-[#8b95a8]
                hover:text-[#00f0ff]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                   style={{
                     boxShadow: '0 0 20px rgba(0, 240, 255, 0.07) inset'
                   }} />
              
              <div className="relative z-10 h-full flex items-center justify-center">
                <span className="font-orbitron tracking-wide text-center">
                  Liked Snippets
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-data-[state=active]:scale-x-100 
                            transition-transform duration-200 origin-center">
                <div className="h-full bg-[#00f0ff]" />
                <div className="absolute inset-0 bg-[#00f0ff] blur-[2px]" />
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="relative group h-full transition-colors duration-200
                data-[state=active]:text-[#00f0ff] text-[#8b95a8]
                hover:text-[#00f0ff]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                   style={{
                     boxShadow: '0 0 20px rgba(0, 240, 255, 0.07) inset'
                   }} />
              
              <div className="relative z-10 h-full flex items-center justify-center">
                <span className="font-orbitron tracking-wide text-center">
                  Settings
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-data-[state=active]:scale-x-100 
                            transition-transform duration-200 origin-center">
                <div className="h-full bg-[#00f0ff]" />
                <div className="absolute inset-0 bg-[#00f0ff] blur-[2px]" />
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="my-snippets" asChild>
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 pt-10"
        >
          <div className="space-y-3">
            <h2 
              className="text-[28px] font-orbitron font-bold text-[#00f0ff] tracking-wide"
              style={headerStyles.title}
            >
              My Snippets
            </h2>
            <p className="text-[#8b95a8] text-[15px] tracking-wide font-light leading-relaxed">
              View and manage your code snippets
            </p>
          </div>
          <div className="grid gap-6 pt-4">
            <SnippetList snippets={mySnippets} showActions={true} />
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="liked-snippets" asChild>
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 pt-10"
        >
          <div className="space-y-3">
            <h2 
              className="text-[28px] font-orbitron font-bold text-[#00f0ff] tracking-wide"
              style={headerStyles.title}
            >
              Liked Snippets
            </h2>
            <p className="text-[#8b95a8] text-[15px] tracking-wide font-light leading-relaxed">
              Your favorite code snippets
            </p>
          </div>
          <div className="grid gap-6 pt-4">
            <SnippetList snippets={likedSnippets} />
          </div>
        </motion.div>
      </TabsContent>

      <TabsContent value="settings" asChild>
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 pt-10"
        >
          <div className="space-y-3">
            <h2 
              className="text-[28px] font-orbitron font-bold text-[#00f0ff] tracking-wide"
              style={headerStyles.title}
            >
              Profile Settings
            </h2>
            <p className="text-[#8b95a8] text-[15px] tracking-wide font-light leading-relaxed">
              Manage your account preferences
            </p>
          </div>
          <div className="pt-4">
            <ProfileSettings user={user} />
          </div>
        </motion.div>
      </TabsContent>
    </Tabs>
  );
} 