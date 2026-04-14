import CounsellingClient from "./CounsellingClient";

export default async function CounsellingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CounsellingClient id={id} />;
}