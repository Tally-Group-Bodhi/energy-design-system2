"use client";

import Button from "@/components/Button/Button";
import { Card, CardContent } from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Checkbox from "@/components/Checkbox/Checkbox";
import { RadioGroup, RadioItem } from "@/components/RadioGroup/RadioGroup";
import { Icon } from "@/components/ui/icon";
import EosPageHeader from "../components/eos-page-header";
import EosSectionHeader from "../components/eos-section-header";
import EosStepper from "../components/eos-stepper";
import type { EosStep } from "../components/eos-stepper";

const STEPS: EosStep[] = [
  { label: "Get offers", status: "active" },
  { label: "Choose offers & terms", status: "upcoming" },
  { label: "Customer details", status: "upcoming" },
  { label: "Summary", status: "upcoming" },
  { label: "Confirm enrollment", status: "upcoming" },
];

export default function NewEnrollmentView() {
  return (
    <div className="space-y-6">
      <EosPageHeader
        icon="add_circle"
        crumbs={[
          { label: "EOS" },
          { label: "Acquisitions" },
          { label: "New Enrollment" },
        ]}
        title="New Enrollment"
        description="Create a new customer enrollment. Complete each step to submit."
        actions={
          <>
            <Button variant="ghost" size="sm" type="button">
              Save draft
            </Button>
            <Button variant="outline" size="sm" type="button">
              Cancel
            </Button>
          </>
        }
      />

      <EosStepper steps={STEPS} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden shadow-none">
          <EosSectionHeader
            title="Confirm location & sales channel"
            description="Step 1 of 2 in get offers"
          />
          <CardContent className="space-y-5 p-5">
            <RadioGroup label="Voltage">
              <div className="grid grid-cols-2 gap-2">
                <RadioItem name="voltage" value="lv" label="Low voltage (LV)" defaultChecked />
                <RadioItem name="voltage" value="hv" label="High voltage (HV)" />
              </div>
            </RadioGroup>

            <RadioGroup label="Service type">
              <div className="grid grid-cols-3 gap-2">
                <RadioItem name="service" value="switch" label="Switch" defaultChecked />
                <RadioItem name="service" value="move-in" label="Move in" />
                <RadioItem name="service" value="new" label="New construction" />
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Utility account number
                  <span className="text-[#C40000]">*</span>
                  <button type="button" className="text-muted-foreground" aria-label="Help">
                    <Icon name="info" size={14} />
                  </button>
                </label>
                <Checkbox label="Skip" />
              </div>
              <Input placeholder="0000 0000 0000 0000 0000" />
              <p className="text-xs text-muted-foreground">
                20 digits, as printed on the customer's utility bill.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Retailer name *" defaultValue="">
                <option value="">Select retailer…</option>
              </Select>
              <Select label="Division *" defaultValue="">
                <option value="">Select…</option>
              </Select>
              <Select label="Sales channel *" defaultValue="">
                <option value="">Select channel…</option>
              </Select>
              <Select label="Agency" defaultValue="">
                <option value="">Optional</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-none">
          <EosSectionHeader
            title="Service location details"
            description="Step 2 of 2 in get offers"
          />
          <CardContent className="space-y-5 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
              <Input label="Postal code *" placeholder="000-0000" />
              <Input label="Address 1 *" />
            </div>
            <Input label="Address 2 *" />
            <Select label="Wheeling service calculation type *" defaultValue="">
              <option value="">Select…</option>
            </Select>
            <Select label="Utility area *" defaultValue="">
              <option value="">Select…</option>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <p className="text-xs text-muted-foreground">
          Required fields are marked with <span className="text-[#C40000]">*</span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button" disabled>
            <Icon name="arrow_back" size={16} className="mr-1.5" />
            Back
          </Button>
          <Button variant="primary" size="sm" type="button">
            Continue
            <Icon name="arrow_forward" size={16} className="ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
