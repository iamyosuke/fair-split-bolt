import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteIcon, ChartBarIcon, ScanIcon, UsersIcon, SplitIcon } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4ade8020_1px,transparent_1px),linear-gradient(to_bottom,#4ade8020_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <SplitIcon className="h-16 w-16 text-primary" />
              <span className="text-4xl font-bold">FairSplit</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Split Expenses,
              </span>
              <br />
              <span className="text-gray-900">Not Friendships</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              The smartest way to manage shared expenses. Perfect for roommates,
              trips, and groups. Powered by AI receipt scanning.
            </p>
            <div className="flex justify-center">
              <Link href="/groups/new">
                <Button size="lg" className="text-lg h-14 px-8">
                  Start Splitting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Features for Modern Expense Sharing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Designed for the way you live and spend together
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white border-primary/10 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanIcon className="h-6 w-6 text-primary" />
                  Smart Receipt Scanning
                </CardTitle>
                <CardDescription>
                  Just snap a photo of your receipt and let AI do the work
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-primary/10 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBarIcon className="h-6 w-6 text-primary" />
                  Intelligent Splitting
                </CardTitle>
                <CardDescription>
                  Automatically calculate the fairest way to split expenses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-primary/10 shadow-lg shadow-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BanknoteIcon className="h-6 w-6 text-primary" />
                  Multiple Currencies
                </CardTitle>
                <CardDescription>
                  Support for all major currencies with real-time conversion
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-4">1M+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-4">$500M+</div>
              <div className="text-gray-600">Expenses Tracked</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-4">190+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-b from-white to-secondary/20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-primary text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg">
                Join millions of users who trust FairSplit for their expense sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/groups/new">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full md:w-auto text-lg h-14 px-8"
                >
                  Create Your First Group
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}