export default function createUniqueId() {
  return `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
}
