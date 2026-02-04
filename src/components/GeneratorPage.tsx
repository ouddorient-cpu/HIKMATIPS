'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Download,
  Loader2,
  Moon,
  BookOpen,
  Search,
  BookMarked,
  LogIn,
  LogOut,
  Share2,
  Play,
  User,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import html2canvas from 'html2canvas';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { generateHadith } from '@/ai/flows/generate-hadith';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import OnboardingScreen from '@/components/OnboardingScreen';


type Content = {
  content: string;
  source: string;
};

type Category = 'hadith' | 'ramadan' | 'recherche-ia' | 'coran';

export default function GeneratorPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [category, setCategory] = useState<Category>('coran');
  const [background, setBackground] = useState<string>(
    PlaceHolderImages[0]?.imageUrl || 'https://picsum.photos/seed/1/1080/1920'
  );
  const [animationKey, setAnimationKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [generationCount, setGenerationCount] = useState(0);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Fixed values for simplified mode
  const fontSize = 24;
  const creatorSignature = '@Hikmaclips';

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const [isConnecting, setIsConnecting] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');

  const handleSignIn = async () => {
    if (!auth || isConnecting) return;

    setIsConnecting(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue !',
      });
      setShowSignInPopup(false);
      setGenerationCount(0);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log('Authentification annulée ou fermée par l\'utilisateur');
        return;
      }

      console.error('Erreur de connexion:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: "Une erreur s'est produite lors de la connexion.",
      });
      setShowSignInPopup(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!auth || isConnecting) return;
    if (!authEmail || !authPassword) {
      setAuthError('Veuillez remplir tous les champs.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsConnecting(true);
    setAuthError('');

    try {
      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        toast({
          title: 'Compte créé !',
          description: 'Bienvenue sur HikmaClips !',
        });
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue !',
        });
      }
      setShowSignInPopup(false);
      setGenerationCount(0);
      setAuthEmail('');
      setAuthPassword('');
    } catch (error: any) {
      console.error('Erreur auth email:', error);
      let message = "Une erreur s'est produite.";
      if (error.code === 'auth/email-already-in-use') {
        message = 'Cet email est déjà utilisé. Essayez de vous connecter.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Adresse email invalide.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Email ou mot de passe incorrect.';
      }
      setAuthError(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté.',
    });
  };

  const handleGenerateAiContent = async () => {
    if (!user && generationCount >= 5) {
      setShowSignInPopup(true);
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateHadith({ category, topic });
      if (result && result.content) {
        setContent(result);
        toast({
          title: 'Contenu généré !',
          description: 'Votre nouveau contenu est prêt.',
        });
        if (!user) {
          setGenerationCount(prev => prev + 1);
        }
      } else {
        throw new Error('La génération a échoué ou n\'a retourné aucun contenu.');
      }
    } catch (error) {
      console.error("Erreur lors de la génération de contenu par l'IA:", error);
      toast({
        variant: 'destructive',
        title: 'Erreur de génération',
        description:
          "Une erreur s'est produite lors de la communication avec l'IA. Veuillez réessayer.",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setBackground(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomBackground = () => {
    const relevantImages = PlaceHolderImages.filter(img => {
      const hint = img.imageHint.toLowerCase();
      if (category === 'hadith' || category === 'coran' || category === 'recherche-ia') {
        return hint.includes('islamic') || hint.includes('nature') || hint.includes('serene') || hint.includes('abstract');
      }
      if (category === 'ramadan') {
        return hint.includes('ramadan') || hint.includes('islamic') || hint.includes('mosque') || hint.includes('lantern');
      }
      return true;
    });

    const pool = relevantImages.length > 0 ? relevantImages : PlaceHolderImages;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setBackground(pool[randomIndex].imageUrl);
  };

  const generateCanvas = async () => {
    const previewEl = previewRef.current;
    if (!previewEl || !content) return null;

    try {
      const canvas = await html2canvas(previewEl, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });
      return canvas;
    } catch (error) {
      console.error('La génération du canvas a échoué:', error);
      return null;
    }
  };

  const handleDownloadImage = useCallback(async () => {
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Impossible de générer l\'image',
        description: 'Veuillez d\'abord générer un contenu.',
      });
      return;
    }

    setIsGenerating(true);
    toast({
      title: 'Génération de l\'image en cours...',
      description: 'Veuillez patienter...',
    });

    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Canvas null');

      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = `hikmaclips_${category}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'Image téléchargée !',
        description: 'Votre image a été enregistrée dans la galerie.',
      });
    } catch (error) {
      console.error('La génération de l\'image a échoué:', error);
      toast({
        variant: 'destructive',
        title: 'La génération de l\'image a échoué',
        description: 'Une erreur s\'est produite. Réessayez ou changez l\'arrière-plan.',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [content, category, toast]);

  const handleShareImage = useCallback(async () => {
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Impossible de partager',
        description: 'Veuillez d\'abord générer un contenu.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Canvas null');

      const base64Data = canvas.toDataURL('image/png').split(',')[1];
      const fileName = `hikma_${Date.now()}.png`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: 'Ma Hikma du jour',
        text: `Découvrez cette sagesse sur HikmaClips : "${content.content}" - ${content.source}`,
        files: [savedFile.uri],
        dialogTitle: 'Partager avec...',
      });

      toast({
        title: 'Partage ouvert',
        description: 'Choisissez une application pour partager votre Hikma.',
      });

    } catch (error) {
      console.error('Le partage a échoué:', error);
      toast({
        title: 'Partage',
        description: 'Utilisez le bouton de téléchargement pour enregistrer et partager manuellement.',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [content, toast]);

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onComplete={handleCompleteOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2">
            <Image src="https://res.cloudinary.com/dhjwimevi/image/upload/v1770072891/ChatGPT_Image_2_f%C3%A9vr._2026_23_43_44_edeg9a.png" alt="HikmaClips" width={36} height={36} className="rounded-lg" />
            <h1 className="text-xl font-bold text-hikma-gradient">HikmaClips</h1>
          </div>
          <div className="flex items-center gap-4">
            {isUserLoading ? (
              <Loader2 className="animate-spin" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'Avatar'} />
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          {/* === CONTROLS COLUMN (LEFT) === */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Card 1: Catégorie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                  <Sparkles className="text-primary" />
                  Choisir une catégorie
                </CardTitle>
                <CardDescription>
                  Sélectionnez le type de contenu à générer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue="coran"
                  className="grid grid-cols-2 gap-3"
                  onValueChange={(value: string) => setCategory(value as Category)}
                >
                  <div>
                    <RadioGroupItem value="coran" id="coran" className="peer sr-only" />
                    <Label
                      htmlFor="coran"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-smooth"
                    >
                      <BookMarked className="mb-3 h-6 w-6" />
                      Coran
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="hadith" id="hadith" className="peer sr-only" />
                    <Label
                      htmlFor="hadith"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-smooth"
                    >
                      <BookOpen className="mb-3 h-6 w-6" />
                      Hadiths
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="ramadan" id="ramadan" className="peer sr-only" />
                    <Label
                      htmlFor="ramadan"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-smooth"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      Ramadan
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="recherche-ia" id="recherche-ia" className="peer sr-only" />
                    <Label
                      htmlFor="recherche-ia"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-smooth"
                    >
                      <Search className="mb-3 h-6 w-6" />
                      Recherche IA
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card 2: Arrière-plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                  <ImageIcon className="text-primary" />
                  Choisir l'arrière-plan
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
                <Button onClick={handleRandomBackground} className="flex-1">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Aléatoire
                </Button>
              </CardContent>
            </Card>

            {/* Card 3: Générer le contenu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                  <Sparkles className="text-primary" />
                  Générer le contenu
                </CardTitle>
                <CardDescription>
                  Décrivez un thème (ex. "patience", "nutrition"). Laissez vide pour un thème aléatoire.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: La patience dans l'épreuve"
                />
                <Button onClick={handleGenerateAiContent} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Génération...' : "Générer le contenu"}
                </Button>
              </CardContent>
            </Card>

            {/* Card 4: Exporter & Partager */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                  <Download className="text-primary" />
                  Exporter & Partager
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  onClick={handleDownloadImage}
                  disabled={!content || isGenerating}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Enregistrer l'image
                </Button>
                <Button
                  onClick={handleShareImage}
                  disabled={!content || isGenerating}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager maintenant
                </Button>
                <Button
                  onClick={() => setAnimationKey(prev => prev + 1)}
                  disabled={!content || isGenerating}
                  variant="ghost"
                  className="w-full h-8 text-xs text-muted-foreground"
                >
                  <Play className="mr-1 h-3 w-3" />
                  Revoir l'animation
                </Button>

              </CardContent>
            </Card>
          </div>

          {/* === PREVIEW COLUMN (RIGHT - STICKY) === */}
          <div className="flex flex-col items-center order-1 lg:order-2 lg:sticky lg:top-8 lg:self-start">
            <div
              className="bg-neutral-900 p-2 sm:p-4 shadow-2xl ring-2 ring-primary/20 transition-all duration-300 w-[280px] h-[590px] sm:w-[320px] sm:h-[673px] lg:w-[340px] lg:h-[715px] rounded-[40px]"
            >
              <div
                ref={previewRef}
                className="relative h-full w-full overflow-hidden bg-black rounded-[25px] sm:rounded-[32px]"
              >
                <Image
                  src={background}
                  alt="Arrière-plan"
                  fill
                  className="object-cover"
                  data-ai-hint="abstract serene"
                  crossOrigin="anonymous"
                  key={background}
                />
                <div className="absolute inset-0 bg-black/50" />

                {(isGenerating && !content) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white/80">
                    <Loader2 className="h-12 w-12 animate-spin mb-4" />
                    <p className="text-lg text-center">Génération du contenu en cours...</p>
                  </div>
                )}

                {content && (
                  <div
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <div className="text-center w-full max-w-4xl">
                      <div className="font-extrabold leading-tight tracking-tight px-4" style={{ fontSize: `${fontSize}px`, fontFamily: "'Roboto', sans-serif" }}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={animationKey + content.content}
                            initial="hidden"
                            animate="visible"
                            variants={{
                              visible: { transition: { staggerChildren: 0.08 } },
                            }}
                            className="text-white"
                          >
                            "
                            {content.content.split(' ').map((word, i) => (
                              <motion.span
                                key={i}
                                variants={{
                                  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
                                  visible: {
                                    opacity: 1,
                                    y: 0,
                                    filter: 'blur(0px)',
                                    transition: { type: 'spring', damping: 12, stiffness: 100 }
                                  },
                                }}
                                className="inline-block mr-2 text-white"
                              >
                                {word}
                              </motion.span>
                            ))}
                            "
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <motion.p
                        key={animationKey + content.source}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: content.content.split(' ').length * 0.08 + 0.5,
                          duration: 0.8,
                          ease: "easeOut"
                        }}
                        className="mt-6 text-lg sm:text-xl font-bold text-white/90 italic tracking-widest uppercase opacity-70"
                      >
                        — {content.source} —
                      </motion.p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                    {creatorSignature}
                  </p>
                </div>

                {!content && !isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center text-white/50">
                      <p className="text-lg">Votre contenu généré apparaîtra ici.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">Politique de Confidentialité</a>
            <span className="hidden sm:inline">·</span>
            <a href="/terms-of-service" className="hover:text-primary transition-colors">Conditions d'Utilisation</a>
          </div>
          <p className="mb-2">
            © {new Date().getFullYear()} HikmaClips · Créé par{' '}
            <a
              href="http://web-linecreator.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              web-linecreator.fr
            </a>
          </p>
          <p>
            Meknès, Maroc
          </p>
        </div>
      </footer>

      <AlertDialog open={showSignInPopup} onOpenChange={(open) => {
        setShowSignInPopup(open);
        if (!open) {
          setAuthError('');
          setAuthEmail('');
          setAuthPassword('');
        }
      }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{authMode === 'signup' ? 'Créer un compte' : 'Se connecter'}</AlertDialogTitle>
            <AlertDialogDescription>
              {authMode === 'signup'
                ? 'Créez un compte gratuit pour des générations illimitées !'
                : 'Connectez-vous pour profiter de générations illimitées.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <Button
              onClick={handleSignIn}
              variant="outline"
              className="w-full"
              disabled={isConnecting}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou par email</span>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                disabled={isConnecting}
              />
              <Input
                type="password"
                placeholder="Mot de passe (min. 6 caractères)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                disabled={isConnecting}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
              />
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
              <Button
                onClick={handleEmailAuth}
                className="w-full"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {authMode === 'signup' ? "S'inscrire" : 'Se connecter'}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {authMode === 'signup' ? (
                <>
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-primary hover:underline"
                  >
                    Se connecter
                  </button>
                </>
              ) : (
                <>
                  Pas de compte ?{' '}
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className="text-primary hover:underline"
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Plus tard</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
