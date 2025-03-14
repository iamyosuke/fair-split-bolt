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
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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
      // Create group
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: values.groupName,
          currency: values.currency,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Create members
      const membersToInsert = values.members.map((member) => ({
        name: member.name,
        group_id: groupData.id,
      }));

      const { error: membersError } = await supabase
        .from("members")
        .insert(membersToInsert);

      if (membersError) throw membersError;

      toast({
        title: "Success!",
        description: "Group created successfully.",
      });

      // Redirect to group page
      router.push(`/groups/${groupData.id}`);
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="bg-white shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Group</CardTitle>
            <CardDescription>
              Start splitting expenses with your friends
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
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Trip to Paris" {...field} />
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
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
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
                    <FormLabel>Members</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "" })}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Member
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
                                placeholder={`Member ${index + 1}`}
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
                  Create Group
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}