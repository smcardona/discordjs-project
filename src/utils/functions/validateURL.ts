import { URL } from 'url';

export default function (url: string) {
  try {
    new URL(url);
    return true
  } catch (err) {
    return false
  }
}