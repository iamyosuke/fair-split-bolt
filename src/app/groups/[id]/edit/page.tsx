"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditGroup() {
  const t = useTranslations("groupEdit");
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const formSchema = z.object({
    groupName: z.string().min(1, t("groupNameRequired")),
    members: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, t("memberNameRequired")),
      })
    ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      members: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  useEffect(() => {
    async function fetchGroupData() {
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("name, members (id, name)")
        .eq("id", params.id)
        .single();

      if (groupError) {
        toast({
          title: t("error"),
          description: groupError.message,
          variant: "destructive",
        });
        return;
      }

      form.reset({
        groupName: group.name,
        members: group.members,
      });

      setLoading(false);
    }

    fetchGroupData();
  }, [params.id, form, toast, t]);

  async function onSubmit(values: FormValues) {
    try {

      const { error: groupError } = await supabase
        .from("groups")
        .update({ name: values.groupName })
        .eq("id", params.id);

      if (groupError) throw groupError;

      const { error: deleteError } = await supabase
        .from("members")
        .delete()
        .eq("group_id", params.id);

      if (deleteError) throw deleteError;

      const membersToInsert = values.members.map((member) => ({
        name: member.name,
        group_id: params.id,
      }));

      const { error: membersError } = await supabase
        .from("members")
        .insert(membersToInsert);

      if (membersError) throw membersError;

      toast({
        title: t("success"),
        description: t("groupUpdated"),
      });

      router.push(`/groups/${params.id}`);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedToUpdateGroup"),
        variant: "destructive",
      });
    } finally {
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="bg-white shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">{t("editGroup")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 mb-4" />
              <Skeleton className="h-10 mb-4" />
              <Skeleton className="h-10 mb-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="bg-white shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">{t("editGroup")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("groupName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("groupNamePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("members")}</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "" })}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {t("addMember")}
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
                                placeholder={t("memberPlaceholder", { number: index + 1 })}
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {t("saveChanges")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}