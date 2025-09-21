'use client';

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Space,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ControlItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="grid h-10 w-10 place-items-center rounded-md bg-muted text-2xl">
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </div>
);

export function ControlsGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ControlItem icon={<ArrowLeft size={20} />} label="Move Left" />
        <ControlItem icon={<ArrowRight size={20} />} label="Move Right" />
        <ControlItem icon={<ArrowDown size={20} />} label="Soft Drop" />
        <ControlItem icon={<RotateCw size={20} />} label="Rotate" />
        <ControlItem icon={<Space size={20} />} label="Hard Drop" />
      </CardContent>
    </Card>
  );
}
