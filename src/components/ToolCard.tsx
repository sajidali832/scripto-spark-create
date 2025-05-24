
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
  comingSoon?: boolean;
}

export function ToolCard({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  comingSoon = false 
}: ToolCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`rounded-xl overflow-hidden cursor-pointer group`}
      onClick={!comingSoon ? onClick : undefined}
    >
      <div className="relative h-full flex flex-col bg-white shadow-lg hover:shadow-2xl rounded-xl overflow-hidden">
        {/* Animated gradient header */}
        <motion.div 
          className={`h-2 bg-gradient-to-r ${color} w-full`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          <motion.div 
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-4`}
            whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-white">{icon}</div>
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm flex-grow">{description}</p>
          
          {comingSoon ? (
            <div className="mt-4 inline-flex items-center text-sm font-medium text-gray-400">
              Coming Soon
            </div>
          ) : (
            <motion.div 
              className="mt-4 inline-flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-800"
              whileHover={{ x: 5 }}
            >
              Try Now
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-2" />
            </motion.div>
          )}

          {/* Animated badge for coming soon */}
          {comingSoon && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-3 right-3 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              Soon
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
