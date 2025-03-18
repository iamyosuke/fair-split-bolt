'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { CameraIcon, UploadIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { fetchGroup, createExpense } from '@/lib/api';

type Group = {
  id: string;
  name: string;
  currency: string;
  members: string[];
  created_at: string;
};

export default function NewExpense() {
  const t = useTranslations('expense');

  const formSchema = z.object({
    description: z.string().min(1, t('descriptionRequired')),
    amount: z
      .string()
      .min(1, t('amountRequired'))
      .regex(/^\d+(\.\d{0,2})?$/, t('invalidAmount')),
    payerId: z.string().min(1, t('payerRequired')), // メンバーの名前
    participants: z.array(z.string()).min(1, t('participantRequired')), // メンバー名の配列
  });

  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: '',
      payerId: '',
      participants: [],
    },
  });

  useEffect(() => {
    async function fetchGroupData() {
      try {
        const groupData = await fetchGroup(params.id as string);
        setGroup(groupData);
        // Set all members as participants by default
        form.setValue('participants', groupData.members);
      } catch (error: any) {
        toast({
          title: t('error'),
          description: error.message || t('failedToAddExpense'),
          variant: 'destructive',
        });
      }
    }

    if (params.id) {
      fetchGroupData();
    }
  }, [params.id, form, toast, t]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const amount = parseFloat(values.amount);

      await createExpense({
        group_id: params.id as string,
        description: values.description,
        amount,
        payer: values.payerId, // payerIdはメンバーの名前
        participants: values.participants, // participantsはメンバー名の配列
      });

      toast({
        title: t('success'),
        description: t('expenseAdded'),
      });

      router.push(`/groups/${params.id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('failedToAddExpense'),
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('addNewExpense')}</CardTitle>
            <CardDescription>{t('enterDetailsOrScanReceipt')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-8 space-x-4">
              <Button
                variant="outline"
                className="w-40 h-40 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  // TODO: Implement camera functionality
                  toast({
                    title: t('comingSoon'),
                    description: t('cameraFunctionality'),
                  });
                }}
              >
                <CameraIcon className="h-8 w-8" />
                <span>{t('takePhoto')}</span>
              </Button>
              <Button
                variant="outline"
                className="w-40 h-40 flex flex-col items-center justify-center space-y-2"
                onClick={() => {
                  // TODO: Implement upload functionality
                  toast({
                    title: t('comingSoon'),
                    description: t('uploadFunctionality'),
                  });
                }}
              >
                <UploadIcon className="h-8 w-8" />
                <span>{t('uploadReceipt')}</span>
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('description')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('egDinner')} {...field} />
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
                      <FormLabel>{t('amount')}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder={t('zeroZero')} {...field} />
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
                      <FormLabel>{t('paidBy')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectWhoPaid')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {group?.members.map((memberName) => (
                            <SelectItem key={memberName} value={memberName}>
                              {memberName}
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
                      <FormLabel>{t('splitBetween')}</FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        {group?.members.map((memberName) => (
                          <FormField
                            key={memberName}
                            control={form.control}
                            name="participants"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(memberName)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      const updated = checked ? [...current, memberName] : current.filter(name => name !== memberName);
                                      field.onChange(updated);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{memberName}</FormLabel>
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
                  {t('addNewExpense')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
