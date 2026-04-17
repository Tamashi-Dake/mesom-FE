import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateDisplaySettings } from "../api";
import { useTheme } from "@/app/providers/themeProvider";
import Button from "@/components/shared/Button";
import AuthorAvatar from "@/modules/posts/components/AuthorAvatar";
import { InputAccentRadio } from "./InputAccentRadio";
import { InputThemeRadio } from "./InputThemeRadio";
import { displaySettingsSchema, type DisplaySettingsFormData } from "../schema";

const themes = [
  ["light", "Default"],
  ["dim", "Dim"],
  ["dark", "Lights out"],
] as const;

const accentsColor = [
  "blue",
  "yellow",
  "pink",
  "purple",
  "orange",
  "green",
] as const;

const DisplayModal = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const { accent, theme, changeTheme } = useTheme();
  const previewRef = useRef(null);

  const { watch, setValue, handleSubmit } = useForm<DisplaySettingsFormData>({
    resolver: zodResolver(displaySettingsSchema),
    defaultValues: {
      theme: (theme as DisplaySettingsFormData["theme"]) || "light",
      accent: (accent as DisplaySettingsFormData["accent"]) || "blue",
    },
  });

  const previewTheme = watch("theme");
  const previewAccent = watch("accent");

  const displayMutate = useMutation({
    mutationFn: updateDisplaySettings,
    onSuccess: () => {
      toast.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      closeModal();
    },
  });

  useEffect(() => {
    const targetTheme = previewTheme === "dim" ? "dark" : previewTheme;
    if (previewRef.current) {
      if (targetTheme === "dark") {
        previewRef.current.classList.add("dark", "text-dark-primary");
      } else {
        previewRef.current.classList.remove("dark", "text-dark-primary");
      }
      previewRef.current.style.setProperty(
        "--preview-background",
        `var(--${previewTheme}-background)`,
      );
    }
  }, [previewTheme]);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.style.setProperty(
        "--preview-accent",
        `var(--accent-${previewAccent})`,
      );
    }
  }, [previewAccent]);

  const onSubmit = (data: DisplaySettingsFormData) => {
    displayMutate.mutate({ theme: data.theme, accent: data.accent });
    changeTheme({ theme: data.theme, accent: data.accent });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="text-2xl font-bold text-main-primary">
          Customize your view
        </h2>
        <p className="text-main-secondary">
          These display settings affect this account on Mesom.
        </p>
      </div>
      <article
        className="hover-animation rounded-2xl border border-light-border bg-preview-background px-4 py-3 dark:border-dark-border"
        ref={previewRef}
      >
        <div className="grid grid-cols-[auto,1fr] gap-3">
          <AuthorAvatar src="/assets/mesom-avatar.jpg" alt="User" />
          <div>
            <div className="flex gap-1">
              <span className="font-bold hover:underline">Mesom</span>
              <p className="text-main-secondary">@mesom</p>
              <div className="flex gap-1 text-main-secondary">
                <i>·</i>
                <p>8m</p>
              </div>
            </div>
            <p className="whitespace-pre-line break-words">
              Mesom text preview.{" "}
              <span className="text-preview-accent">@mesom</span>{" "}
              <span className="text-preview-accent">#mesom</span>
            </p>
          </div>
        </div>
      </article>
      <div className="flex w-full flex-col gap-1">
        <p className="px-4 font-bold text-main-primary">Color</p>
        <div className="hover-animation grid grid-cols-3 grid-rows-2 justify-items-center gap-3 rounded-2xl bg-main-sidebar-background py-3 xs:grid-cols-6 xs:grid-rows-none">
          {accentsColor.map((accentColor) => (
            <InputAccentRadio
              type={accentColor}
              key={accentColor}
              changePreviewAccent={(e) => setValue("accent", e.target.value as DisplaySettingsFormData["accent"])}
              previewAccent={previewAccent}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <p className="px-4 font-bold text-main-primary">Background</p>
        <div className="hover-animation grid grid-rows-3 gap-3 rounded-2xl bg-main-sidebar-background px-4 py-3 xs:grid-cols-3 xs:grid-rows-none">
          {themes.map(([themeType, label]) => (
            <InputThemeRadio
              type={themeType}
              label={label}
              key={themeType}
              changePreviewTheme={(e) => setValue("theme", e.target.value as DisplaySettingsFormData["theme"])}
              previewTheme={previewTheme}
            />
          ))}
        </div>
      </div>
      <Button
        className="bg-main-accent px-4 py-1.5 font-bold text-white hover:bg-main-accent/90 active:bg-main-accent/75"
        onClick={handleSubmit(onSubmit)}
        label={"Done"}
      />
    </div>
  );
};

export default DisplayModal;
