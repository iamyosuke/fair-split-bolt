"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { createGroup } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

type Group = {
  id: string;
  name: string;
  currency: string;
  members: string[];
  created_at: string;
};

const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
] as const;

const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  currency: z.string().min(1, "Currency is required"),
  members: z.array(
    z.object({
      name: z.string().min(1, "Member name is required"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  groupName: "",
  currency: "USD",
  members: [{ name: "" }],
};

export default function NewGroup() {
  const t = useTranslations("groupCreation.form");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  async function onSubmit(values: FormValues) {
    try {
      // Create group with members array
      const groupData = await createGroup({
        name: values.groupName,
        currency: values.currency,
        members: values.members.map(member => member.name),
      });

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      // Redirect to confirmation page with group ID
      router.push(`/groups/confirmation?id=${groupData.id}`);
    } catch (error: any) {
      console.log("Error creating group:", error);
      toast({
        title: t("error"),
        description: error.message || t("failedToCreateGroup"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="bg-white shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">{t("groupName.label")}</CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("groupName.label")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("groupName.placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("currency.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("currency.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("members.label")}</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "" })}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {t("members.addButton")}
                    </Button>
                  </div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={t("members.placeholder", { number: index + 1 })}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                          onClick={() => remove(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full">
                  {t("createGroup")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
