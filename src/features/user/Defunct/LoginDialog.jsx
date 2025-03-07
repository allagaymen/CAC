import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import AlertElement from "@/components/ui/AlertElement";
import SkeletonUser from "@/components/ui/SkeletonUser";
import { useLogin } from "../useLogin";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  rememberMe: z.boolean().default(false),
});

export function LoginDialog() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { loginUser, error, isConnecting, other } = useLogin();
  function onSubmit(values) {
    loginUser({
      email: values.email,
      password: values.password,
    });
  }
  console.log(other, error);

  return (
    <Dialog>
      {error ? (
        <>
          <SkeletonUser />
          <AlertElement errorMessage="(500) Serveur est en panne. Veuillez essayer plus tard." />
        </>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" className="my-2">
            Connectez-vous
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-muted-foreground">
          Connectez-vous pour plus d&apos;options et poser vos questions en Q&A.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={error ? "text-red-500" : ""}>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Saisissez votre email..."
                      {...field}
                      className={error ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={error ? "text-red-500" : ""}>
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Saisissez votre mot de passe..."
                      className={error ? "border-destructive" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Se souvenir de moi
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button variant="link" className="px-0">
                Mot de passe oublié ?
              </Button>
            </div>

            {error && (
              <>
                <div className="text-sm font-medium text-destructive"></div>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isConnecting || form.formState.isSubmitting}
            >
              {isConnecting || form.formState.isSubmitting
                ? "Connexion..."
                : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Vous n&apos;avez pas de compte ?{" "}
          <Button variant="link" className="px-0">
            Inscrivez-vous dès maintenant !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
