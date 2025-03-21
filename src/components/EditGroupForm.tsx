"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchGroup, updateGroup } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

type Group = {
  id: string;
  name: string;
  currency: string;
  members: string[];
  created_at: string;
};

const formSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  members: z.array(
    z.object({
      name: z.string().min(1, "Member name is required")
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function EditGroupForm() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const t = useTranslations("groupEdit");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      members: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: "members",
  });

  useEffect(() => {
    async function fetchGroupData() {
      try {
        const group = await fetchGroup(params.id as string);
        form.reset({
          groupName: group.name,
          members: group.members,
        });
        setLoading(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    if (params.id) {
      fetchGroupData();
    }
  }, [params.id, form, toast]);

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);

      await updateGroup(params.id as string, {
        name: values.groupName,
        members: values.members,
      });

      toast({
        title: "Success",
        description: "Group updated successfully.",
      });

      router.push(`/groups/${params.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update group.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }


  return (
    <Card className="bg-white shadow-lg shadow-primary/5">
      <CardHeader>
        <CardTitle>{t("editGroup")}</CardTitle>
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
  );
} 