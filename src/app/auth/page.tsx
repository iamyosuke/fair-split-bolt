// "use client";

import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { useTranslations } from "next-intl";

// export default function AuthPage() {
//   const t = useTranslations();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { toast } = useToast();

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (error) throw error;

//       toast({
//         title: t("auth.success"),
//         description: t("auth.accountCreated"),
//       });
//     } catch (error: any) {
//       toast({
//         title: t("auth.error"),
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       router.push("/");
//       router.refresh();
//     } catch (error: any) {
//       toast({
//         title: t("auth.error"),
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white py-12">
//       <div className="container max-w-md mx-auto px-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>{t("auth.welcome")}</CardTitle>
//             <CardDescription>
//               {t("auth.signInOrCreateAccount")}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">{t("auth.email")}</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder={t("auth.enterEmail")}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">{t("auth.password")}</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder={t("auth.enterPassword")}
//                   required
//                 />
//               </div>
//               <div className="flex gap-4">
//                 <Button
//                   type="submit"
//                   className="flex-1"
//                   onClick={handleSignIn}
//                   disabled={loading}
//                 >
//                   {t("auth.signIn")}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={handleSignUp}
//                   disabled={loading}
//                 >
//                   {t("auth.signUp")}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
export default function AuthPage() {
  const router = useRouter();
  router.push('/');
  return <div>AuthPage</div>;
}
