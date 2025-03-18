'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchGroup, updateGroup } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusIcon, TrashIcon, CopyIcon, ShareIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

type Group = {
  id: string;
  name: string;
  currency: string;
  members: string[];
  created_at: string;
};

export default function EditGroup() {
  const t = useTranslations('groupEdit');
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const formSchema = z.object({
    groupName: z.string().min(1, t('groupNameRequired')),
    members: z.array(z.string().min(1, t('memberNameRequired'))),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: '',
      members: [''],
    },
  });

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: form.control,
    name: 'members',
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
          title: t('error'),
          description: error.message,
          variant: 'destructive',
        });
      }
    }

    if (params.id) {
      fetchGroupData();
    }
  }, [params.id, form, toast, t]);

  async function onSubmit(values: FormValues) {
    try {
      await updateGroup(params.id as string, {
        name: values.groupName,
        members: values.members
      });

      toast({
        title: t('success'),
        description: t('groupUpdated'),
      });

      router.push(`/groups/${params.id}`);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('failedToUpdateGroup'),
        variant: 'destructive',
      });
    }
  }

  const groupUrl = `${window.location.origin}/groups/${params.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(groupUrl);
      setCopied(true);
      toast({
        title: 'Success!',
        description: 'Group URL copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to copy URL',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my FairSplit group',
          text: 'Join my expense sharing group on FairSplit',
          url: groupUrl,
        });
        toast({
          title: 'Success!',
          description: 'Group URL shared successfully',
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err) {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="bg-white shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">{t('editGroup')}</CardTitle>
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
            <CardTitle className="text-2xl">{t('editGroup')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 mt-4">
              <div className="text-sm font-medium">{t('shareWithFriends')}</div>
              <div className="flex gap-2 mb-4">
                <Input value={groupUrl} readOnly className="font-mono text-sm" onClick={(e) => e.currentTarget.select()} />
                <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                  <CopyIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} className="shrink-0">
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('groupName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('groupNamePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('members')}</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {t('addMember')}
                    </Button>
                  </div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`members.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder={t('memberPlaceholder', { number: index + 1 })} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index > 0 && (
                        <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => remove(index)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {t('saveChanges')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
