
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Play, Settings, HelpCircle, ChevronDown } from "lucide-react";
import type { Screen } from "@/pages/Index";

interface SidebarProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
}

export const Sidebar = ({ onNavigate, currentScreen }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard' as Screen, label: 'Home', icon: Home },
    { id: 'extraction' as Screen, label: 'Extractions', icon: Play },
    { id: 'settings' as Screen, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SlideSnip</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentScreen === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                currentScreen === item.id 
                  ? "bg-blue-50 text-blue-900 border-blue-200" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <HelpCircle className="w-4 h-4 mr-3" />
            Help
          </Button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start p-2">
          <Avatar className="w-8 h-8 mr-3">
            <AvatarFallback className="bg-blue-100 text-blue-900">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">john@example.com</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </div>
    </div>
  );
};
