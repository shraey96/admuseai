import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Info, X } from "lucide-react";
import Image from "next/image";
import { SAMPLE_IMAGES } from "@/constants/samples";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { trackAnalytics, ANALYTICS_EVENTS } from "@/lib/analytics";
import { getTemplateName } from "@/lib/prompt-wizard-config";
interface ExamplePreviewProps {
  example: (typeof SAMPLE_IMAGES)[0];
  onClose: () => void;
}

export default function ExamplePreview({
  example,
  onClose,
}: ExamplePreviewProps) {
  const [activeImage, setActiveImage] = useState<string>(example.image);

  // Combine main image with reference images for the gallery
  const allImages = [
    { url: example.image, isReference: false },
    ...(example.referenceImages?.map((url) => ({ url, isReference: true })) ||
      []),
  ];

  const currentImageIsReference =
    allImages.find((img) => img.url === activeImage)?.isReference || false;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 gap-0 h-[90vh] md:h-auto overflow-y-auto">
        {/* Fixed close button that stays visible on scroll */}

        <div className="p-4 sm:p-6 pb-0">
          <div className="flex items-center mb-4 pr-8">
            <div className="h-8 w-8 flex items-center justify-center mr-3">
              <img
                src="/images/admuse.png"
                alt="AdMuseAI Logo"
                className="h-8 w-8"
              />
            </div>
            <span className="text-[#6366f1] font-semibold text-lg">
              AdMuseAI
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {example.headline}
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            {example.description}
          </p>
        </div>

        <div className="relative h-[min(50vh,320px)] sm:h-[min(65vh,480px)] w-full my-4 sm:my-6 bg-[#F8F9FF]">
          <Image
            src={activeImage}
            alt={example.adType}
            fill
            className="object-contain"
            priority
          />
          {currentImageIsReference && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/50 text-white px-3 py-1 text-sm font-medium">
                Reference Image
              </Badge>
            </div>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="px-4 sm:px-6">
            {example.referenceImages && example.referenceImages.length > 0 && (
              <div className="flex items-start gap-2 mb-4 p-3 bg-[#EEF2FF] rounded-lg border border-[#6366f1]/20">
                <Info className="h-5 w-5 text-[#6366f1] mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-[#4338ca]">
                  <p>
                    Want to create amazing ads like this?{" "}
                    <a
                      href="/prompt-writing-guidelines"
                      className="underline hover:text-[#6366f1] transition-colors"
                      target="_blank"
                      onClick={() => {
                        trackAnalytics(
                          ANALYTICS_EVENTS.PROMPT_WRITING_GUIDELINES_CLICKED,
                          {
                            source: "example_preview",
                          }
                        );
                      }}
                    >
                      Learn how to write effective ad prompts
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-2 overflow-x-auto pb-4 snap-x">
              {allImages.map((img, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group snap-start ${
                          activeImage === img.url
                            ? "ring-2 ring-[#6366f1] ring-offset-2"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setActiveImage(img.url)}
                      >
                        <Image
                          src={img.url}
                          alt={`Image ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {img.isReference && (
                          <div className="absolute top-1 right-1">
                            <Badge
                              variant="secondary"
                              className="bg-black/50 text-white text-[10px] px-1.5"
                            >
                              REF
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    {img.isReference && (
                      <TooltipContent className="bg-black text-white">
                        <p>Reference Image</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 pt-2 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                Visual Style
              </h4>
              <p className="text-gray-600 text-sm">{example.visualStyle}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                Tone
              </h4>
              <p className="text-gray-600 text-sm">{example.tone}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                Template Used
              </h4>
              <p className="text-gray-600 text-sm">
                {getTemplateName(example.templateUsed)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
