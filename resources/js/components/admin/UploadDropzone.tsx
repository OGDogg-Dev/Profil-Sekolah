import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
type UploadDropzoneProps = {
  label: string;
  description?: string;
  accept?: string;
  file?: File | null;
  existingUrl?: string | null;
  onSelect: (file: File | null) => void;
  allowRemove?: boolean;
  disabled?: boolean;
};

export function UploadDropzone({
  label,
  description,
  accept = 'image/*',
  file,
  existingUrl,
  onSelect,
  allowRemove = true,
  disabled = false,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl ?? null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreviewUrl(existingUrl ?? null);

    return undefined;
  }, [file, existingUrl]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || !files.length || disabled) {
        return;
      }

      onSelect(files[0]);
    },
    [disabled, onSelect],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const onBrowse = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setDragging(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={onDrop}
        onClick={onBrowse}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border px-4 py-8 text-center transition ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
            : isDragging
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-dashed border-slate-300 bg-white text-slate-500 hover:border-slate-400'
        }`}
        role="button"
        tabIndex={0}
      >
        <span className="text-sm font-semibold">
          {disabled ? 'Tidak dapat mengunggah' : 'Seret & lepas atau klik untuk unggah'}
        </span>
        {description ? <span className="text-xs text-slate-400">{description}</span> : null}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {previewUrl ? (
        <div className="relative w-full overflow-hidden rounded-2xl border bg-slate-50">
          <img src={previewUrl} alt="Preview" className="w-full object-cover" />
          {allowRemove && !disabled ? (
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(null);
              }}
            >
              Hapus
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}


