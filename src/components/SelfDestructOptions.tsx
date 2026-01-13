import { useState } from 'react';
import { Clock, Trash2, AlertTriangle, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SELF_DESTRUCT_OPTIONS, type SelfDestructOption } from '@/lib/types';

interface SelfDestructOptionsProps {
  value: SelfDestructOption;
  onChange: (value: SelfDestructOption) => void;
  deleteMediaOnly?: boolean;
  onDeleteMediaOnlyChange?: (value: boolean) => void;
}

export function SelfDestructOptions({ 
  value, 
  onChange, 
  deleteMediaOnly = false,
  onDeleteMediaOnlyChange 
}: SelfDestructOptionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {value ? `Auto-delete: ${value} days` : 'Set Auto-Delete'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Auto-Delete Settings
          </DialogTitle>
          <DialogDescription>
            Choose when your post should be automatically deleted. This uses your anonymous deletion token.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Once deleted, content cannot be recovered. Your anonymous deletion token is stored locally and is the only way to delete your posts.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Delete After</Label>
            <RadioGroup
              value={value?.toString() || 'null'}
              onValueChange={(v) => onChange(v === 'null' ? null : parseInt(v) as SelfDestructOption)}
              className="space-y-2"
            >
              {SELF_DESTRUCT_OPTIONS.map((option) => (
                <div key={option.value?.toString() || 'null'} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value?.toString() || 'null'} 
                    id={`destruct-${option.value}`} 
                  />
                  <Label 
                    htmlFor={`destruct-${option.value}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {value && onDeleteMediaOnlyChange && (
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="deleteMediaOnly"
                checked={deleteMediaOnly}
                onCheckedChange={(checked) => onDeleteMediaOnlyChange(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="deleteMediaOnly"
                  className="flex items-center gap-2 font-normal cursor-pointer"
                >
                  <ImageOff className="h-4 w-4" />
                  Delete media only, keep text
                </Label>
                <p className="text-xs text-muted-foreground">
                  Images and videos will be deleted, but the text content will remain.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
