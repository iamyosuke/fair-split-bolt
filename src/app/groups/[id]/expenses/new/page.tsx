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
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/src/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { CameraIcon, UploadIcon } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{0,2})?$/, "Invalid amount"),
  payerId: z.string().min(1, "Payer is required"),
  participants: z.array(z.string()).min(1, "At least one participant is required"),
});

type Member = {
  id: string;
  name: string;
};

export default function NewExpense() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      payerId: "",
      participants: [],
    },
  });

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("members")
        .select("id, name")
        .eq("group_id", params.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load group members",
          variant: "destructive",
        });
        return;
      }

      setMembers(data);
      // Set all members as participants by default
      form.setValue(
        "participants",
        data.map((member) => member.id)
      );
    }

    fetchMembers();
  }, [params.id, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const amount = parseFloat(values.amount);
      const shareAmount = amount / values.participants.length;

      // Create expense
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .insert({
          group_id: params.id,
          description: values.description,
          amount,
          payer_id: values.payerId,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Create expense participants
      const participantsToInsert = values.participants.map((participantId) => ({
        expense_id: expenseData.id,
        member_id: participantId,
        share_amount: shareAmount,
      }));

      const { error: participantsError } = await supabase
        .from("expense_participants")
        .insert(participantsToInsert);

      if (participantsError) throw participantsError;

      toast({
        title: "Success!",
        description: "Expense added successfully.",
      });

      router.push(`/groups/${params.id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>
              Enter expense details or scan a receipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-8 space-x-4">
              <Button
                variant="outline"
                className="w-40 h-40 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  // TODO: Implement camera functionality
                  toast({
                    title: "Coming Soon",
                    description: "Camera functionality will be available soon!",
                  });
                }}
              >
                <CameraIcon className="h-8 w-8" />
                <span>Take Photo</span>
              </Button>
              <Button
                variant="outline"
                className="w-40 h-40 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  // TODO: Implement upload functionality
                  toast({
                    title: "Coming Soon",
                    description: "Upload functionality will be available soon!",
                  });
                }}
              >
                <UploadIcon className="h-8 w-8" />
                <span>Upload Receipt</span>
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dinner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid by</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select who paid" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="participants"
                  render={() => (
                    <FormItem>
                      <FormLabel>Split between</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        {members.map((member) => (
                          <FormField
                            key={member.id}
                            control={form.control}
                            name="participants"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(member.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      const updated = checked
                                        ? [...current, member.id]
                                        : current.filter((id) => id !== member.id);
                                      field.onChange(updated);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {member.name}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Add Expense
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}