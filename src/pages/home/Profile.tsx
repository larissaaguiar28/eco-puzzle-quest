import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save, User, Mail, MapPin, Heart, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const interestOptions = [
  "Energia Solar", "Reciclagem", "Biodiversidade", "Mudanças Climáticas",
  "Conservação Marinha", "Agricultura Sustentável", "Mobilidade Verde", "Economia Circular",
];

export default function Profile() {
  const [name, setName] = useState("Usuário EcoS");
  const [email, setEmail] = useState("usuario@ecos.com");
  const [location, setLocation] = useState("São Paulo, BR");
  const [bio, setBio] = useState("Apaixonado por sustentabilidade e preservação ambiental.");
  const [interests, setInterests] = useState<string[]>(["Energia Solar", "Biodiversidade"]);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Personalizar Perfil</h1>
        <p className="text-sm text-muted-foreground mt-1">Atualize suas informações pessoais</p>
      </motion.div>

      {/* Avatar Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-border">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-foreground/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-background" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground">{bio}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Informações Pessoais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <User size={14} /> Nome
                </label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Mail size={14} /> Email
                </label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin size={14} /> Localização
                </label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Heart size={14} /> Bio
                </label>
                <Input value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interests */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Interesses Ambientais</h3>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium border transition-all",
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
                    )}
                  >
                    {selected && <Check size={12} className="inline mr-1" />}
                    {interest}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Button onClick={handleSave} className="w-full gap-2" size="lg">
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved ? "Salvo com sucesso!" : "Salvar Alterações"}
        </Button>
      </motion.div>
    </div>
  );
}
