'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Moon, Sun, Shield, FileText, Info, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ParametresPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [hdExport, setHdExport] = useState(true);

  const toggleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    document.documentElement.classList.toggle('dark', enabled);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center pt-6 pb-2">
          <h1 className="text-2xl font-bold text-hikma-gradient inline-block">Paramètres</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                <Label htmlFor="dark-mode">Mode sombre</Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-primary" />
                <Label htmlFor="hd-export">Export HD</Label>
              </div>
              <Switch id="hd-export" checked={hdExport} onCheckedChange={setHdExport} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Légal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/privacy-policy">
              <Button variant="ghost" className="w-full justify-between h-12">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Politique de confidentialité
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="ghost" className="w-full justify-between h-12">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Conditions d'utilisation
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              À propos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Développeur</span>
              <span className="font-medium">SounnahMedecine</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
