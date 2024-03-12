import { redirect } from 'next/navigation';
import config from '@/blog';

export default function Blog() {
  redirect(`/blog/${config[0].date}`);
}
