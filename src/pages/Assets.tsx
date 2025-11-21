import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, Music, Image, Video, File } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssets } from "@/hooks/useAssets";

const Assets = () => {
  const { data: assets = [], isLoading } = useAssets();

  const musicAssets = assets.filter(asset => asset.type === "music");
  const imageAssets = assets.filter(asset => asset.type === "image");
  const videoAssets = assets.filter(asset => asset.type === "video");
  const otherAssets = assets.filter(asset => asset.type === "other");

  const handleDownload = (asset: typeof assets[0]) => {
    if (asset.download_url) {
      window.open(asset.download_url, '_blank');
    } else {
      console.log(`No download URL for: ${asset.title}`);
    }
  };

  const AssetCard = ({ asset }: { asset: typeof assets[0] }) => (
    <Card className="bg-card/90 backdrop-blur border-4 border-foreground/20 card-arcade hover:border-primary hover:scale-[1.03] transition-all duration-200 group">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {asset.type === "music" && <Music className="w-5 h-5 text-accent flex-shrink-0 group-hover:text-primary transition-colors" />}
            {asset.type === "image" && <Image className="w-5 h-5 text-accent flex-shrink-0 group-hover:text-primary transition-colors" />}
            {asset.type === "video" && <Video className="w-5 h-5 text-accent flex-shrink-0 group-hover:text-primary transition-colors" />}
            {asset.type === "other" && <File className="w-5 h-5 text-accent flex-shrink-0 group-hover:text-primary transition-colors" />}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base md:text-lg group-hover:text-primary transition-colors">{asset.title}</CardTitle>
              <CardDescription className="text-xs md:text-sm mt-1">{asset.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center pt-4 flex-wrap gap-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">{asset.format}</span> • {asset.size || 'N/A'}
        </div>
        <Button 
          onClick={() => handleDownload(asset)}
          size="sm"
          className="gap-2 bg-primary text-foreground hover:bg-primary/90 btn-arcade"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <SocialSidebar />
      
      <main className="pt-24 pb-16 container mx-auto px-4 animate-fade-in">
        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-6xl text-center pixel-title mb-4">
          Assets & Downloads
        </h1>
        <p className="text-center text-body mb-12 max-w-2xl mx-auto drop-shadow-md">
          Download game assets, music, artwork and more. All files are free to use for personal purposes.
        </p>

        {/* Tabs for different asset types */}
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-card border-2 border-border p-1">
            <TabsTrigger value="music" className="data-[state=active]:bg-primary data-[state=active]:text-foreground font-semibold">
              <Music className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Music</span>
              <span className="sm:hidden">Music</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-foreground font-semibold">
              <Image className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Images</span>
              <span className="sm:hidden">Images</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-foreground font-semibold">
              <Video className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Videos</span>
              <span className="sm:hidden">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="other" className="data-[state=active]:bg-primary data-[state=active]:text-foreground font-semibold">
              <File className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Other</span>
              <span className="sm:hidden">Other</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando música...
              </div>
            ) : musicAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {musicAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No hay archivos de música disponibles.
              </div>
            )}
          </TabsContent>

          <TabsContent value="images">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando imágenes...
              </div>
            ) : imageAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No hay imágenes disponibles.
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando videos...
              </div>
            ) : videoAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No hay videos disponibles.
              </div>
            )}
          </TabsContent>

          <TabsContent value="other">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando otros archivos...
              </div>
            ) : otherAssets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherAssets.map(asset => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No hay otros archivos disponibles.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Assets;
