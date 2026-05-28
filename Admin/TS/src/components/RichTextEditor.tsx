'use client'

import { useMemo } from 'react'
import Quill from '@/components/wrappers/Quill'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  readOnly?: boolean
  minHeight?: number | string
  theme?: 'snow' | 'bubble'
  className?: string
}

const DEFAULT_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['link', 'blockquote', 'code-block'],
  [{ align: [] }],
  ['clean'],
]

const DEFAULT_FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'indent',
  'link',
  'blockquote',
  'code-block',
  'align',
]

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  minHeight = 200,
  theme = 'snow',
  className,
}: RichTextEditorProps) {
  const modules = useMemo(() => ({ toolbar: DEFAULT_TOOLBAR }), [])

  return (
    <div className={className} style={{ ['--rte-min-height' as string]: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }}>
      <Quill
        theme={theme}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={modules}
        formats={DEFAULT_FORMATS}
      />
      <style jsx global>{`
        .ql-container {
          min-height: var(--rte-min-height, 200px);
          font-size: 0.875rem;
        }
        .ql-editor {
          min-height: var(--rte-min-height, 200px);
        }
      `}</style>
    </div>
  )
}