
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, CreditCard, LogOut, ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import type { Screen } from "@/pages/Index";

interface SettingsPanelProps {
  onNavigate: (screen: Screen) => void;
}

export const SettingsPanel = ({ onNavigate }: SettingsPanelProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar onNavigate={onNavigate} currentScreen="settings" />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-900 text-lg">JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">John Doe</h3>
                  <p className="text-gray-600">john.doe@example.com</p>
                  <p className="text-sm text-gray-500">Member since June 2024</p>
                </div>
              </div>
            </Card>

            {/* Subscription Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
                <Button variant="outline" size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Pro Plan</h3>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <p className="text-gray-600">$29/month • Next billing: July 15, 2024</p>
                  <div className="mt-3 text-sm text-gray-500">
                    <div>✓ Unlimited extractions</div>
                    <div>✓ OCR & transcript support</div>
                    <div>✓ Bulk processing</div>
                    <div>✓ Priority support</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Usage Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Statistics</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">47</div>
                  <div className="text-sm text-gray-600">Total Extractions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">1,234</div>
                  <div className="text-sm text-gray-600">Slides Extracted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">28h</div>
                  <div className="text-sm text-gray-600">Videos Processed</div>
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h2>
              
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onNavigate('landing')}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
