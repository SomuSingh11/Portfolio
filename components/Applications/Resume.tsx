import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function Resume() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div className="h-full flex flex-col pb-8 bg-gray-900">
      <div
        className="flex-1 overflow-auto"
        style={{ width: "100%", height: "100%" }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <Viewer
            fileUrl="/Resume_Somu11.pdf"
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  );
}
