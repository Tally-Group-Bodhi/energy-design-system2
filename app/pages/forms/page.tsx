"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Select from "@/components/Select/Select";
import Checkbox from "@/components/Checkbox/Checkbox";
import Button from "@/components/Button/Button";
import Badge from "@/components/Badge/Badge";
import Separator from "@/components/Separator/Separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/Alert/Alert";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/Tooltip/Tooltip";

export default function FormsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const addressLine1 = (formData.get("addressLine1") as string)?.trim();
    const city = (formData.get("city") as string)?.trim();
    const postcode = (formData.get("postcode") as string)?.trim();
    const country = formData.get("country") as string;

    const newErrors: Record<string, string> = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!addressLine1) newErrors.addressLine1 = "Address line 1 is required";
    if (!city) newErrors.city = "City is required";
    if (!postcode) newErrors.postcode = "Postcode is required";
    if (!country) newErrors.country = "Country is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitted(true);
    setErrors({});
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center text-gray-700 transition-colors hover:text-gray-900">
                  <Icon name="home" size={18} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/pages" className="text-gray-700 transition-colors hover:text-gray-900">
                  Pages
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className="rounded bg-gray-100 px-2.5 py-1 font-normal text-gray-900">
                Forms
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Forms
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            A simple name and address form built with design system components.
          </p>
        </div>

        {submitted && (
          <Alert variant="success" className="mb-6">
            <AlertTitle>Form submitted</AlertTitle>
            <AlertDescription>
              Your name and address have been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <CardHeader className="space-y-1.5 pb-6">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-semibold text-gray-900">Name &amp; address</CardTitle>
                <Badge variant="outline" className="text-xs">Required</Badge>
              </div>
              <CardDescription className="text-base">
                Enter your personal details and mailing address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Name section */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Personal details</h2>
                  <Badge variant="secondary" className="text-xs">Name</Badge>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    name="firstName"
                    label="First name"
                    placeholder="Jane"
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                  />
                  <Input
                    name="lastName"
                    label="Last name"
                    placeholder="Smith"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                  />
                </div>
              </section>

              <Separator className="my-8" />

              {/* Address section */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                  <Badge variant="info" className="text-xs">Address</Badge>
                </div>
                <div className="space-y-4">
                  <Input
                    name="addressLine1"
                    label="Address line 1"
                    placeholder="123 Main Street"
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1}
                    required
                  />
                  <Input
                    name="addressLine2"
                    label="Address line 2 (optional)"
                    placeholder="Unit 4, Building A"
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                      name="city"
                      label="City"
                      placeholder="Sydney"
                      error={!!errors.city}
                      helperText={errors.city}
                      required
                    />
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor="postcode" className="text-sm font-medium text-foreground">
                          Postcode
                        </label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex cursor-help text-muted-foreground" aria-label="Help">
                              <Icon name="info" size={16} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Enter your postal or ZIP code.
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="postcode"
                        name="postcode"
                        placeholder="2000"
                        error={!!errors.postcode}
                        helperText={errors.postcode}
                        required
                      />
                    </div>
                  </div>
                  <Select
                    name="country"
                    label="Country"
                    placeholder="Select country"
                    error={!!errors.country}
                    helperText={errors.country}
                    required
                  >
                    <option value="AU">Australia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                  </Select>
                </div>
              </section>

              <Separator className="my-8" />

              <section className="space-y-4">
              <Textarea
                name="notes"
                label="Notes (optional)"
                placeholder="Delivery instructions or other notes..."
                rows={3}
              />

              <Checkbox
                name="saveDefault"
                label="Save as my default address"
                helperText="Use this address for future orders."
              />
              </section>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 border-t border-border pt-6">
              <Button type="submit">
                <Icon name="check_circle" size={18} />
                Submit
              </Button>
              <Button type="reset" variant="outline">
                <Icon name="refresh" size={18} />
                Reset
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
