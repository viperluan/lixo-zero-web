import { Spinner } from '~components/ui';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <Spinner size="lg" className="text-white" />
    </div>
  );
};

export { LoadingOverlay };
