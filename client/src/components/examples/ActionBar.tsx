import ActionBar from '../ActionBar';

export default function ActionBarExample() {
  return (
    <ActionBar
      onSave={() => console.log('Save triggered')}
      onExportPDF={() => console.log('Export PDF triggered')}
      onClear={() => console.log('Clear triggered')}
      onLoad={() => console.log('Load triggered')}
      hasUnsavedChanges={true}
    />
  );
}
