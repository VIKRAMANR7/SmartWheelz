interface OwnerSectionHeaderProps {
  title: string;
  subTitle: string;
}

export default function OwnerSectionHeader({ title, subTitle }: OwnerSectionHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="font-medium text-3xl">{title}</h1>
      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-156">{subTitle}</p>
    </div>
  );
}
