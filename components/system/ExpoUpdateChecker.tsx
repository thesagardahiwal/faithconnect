import { useExpoUpdates } from '@/hooks/useExpoUpdates';
export default function ExpoUpdateChecker() {
  useExpoUpdates();
  return null;
}
