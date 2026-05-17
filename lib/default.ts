import { El_ref, me, u } from "./tools";
import { Rabbit } from "./rabbit";
const ref = new El_ref();
export const default_RabbitSetup = (Rabbit: Rabbit) => {
  Rabbit.installTool("Bold", {
    image: "/rabbit_assets/heading.png",
    tooling({ selectedElement }) {
      Rabbit.showModal("text-setting", selectedElement);
    },
  });
  Rabbit.installTool("Image", {
    image: "/rabbit_assets/img.png",
    tooling({ selectedElement }) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();
      input.addEventListener("change", (e) => {
        const file = (e.target! as any).files[0];
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target!.result as string;
            if (selectedElement) {
              selectedElement?.insertAdjacentElement("afterend", img);
            } else {
              Rabbit._el!.appendChild(img);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    },
  });
  Rabbit.installTool("Link", {
    image: "/rabbit_assets/link.png",
    tooling({ selectedElement, selection, range }) {
      Rabbit.showModal("link", { selectedElement, selection, range });
    },
  });
  // Rabbit.installTool("Color", {
  //   image: color,
  //   tooling({ selectedElement, selection, range }) {
  //     // console.log(selection, selectedElement);
  //     const input = document.createElement("input");
  //     input.type = "color";
  //     input.addEventListener("change", (e) => {
  //       const color = (e.target! as HTMLInputElement).value;
  //       if (selectedElement) {
  //         if (selection) {
  //           if (selection === selectedElement.innerText) {
  //             if (selectedElement?.style.color === color) {
  //               selectedElement!.style.color = "unset";
  //             } else {
  //               selectedElement!.style.color = color;
  //             }
  //           } else {
  //             const span = document.createElement("span");
  //             span.innerText = selection;
  //             span.style.color = color;
  //             range!.deleteContents();
  //             range!.insertNode(span);
  //           }
  //         }
  //       }
  //     });
  //     input.click();
  //   },
  // });
  // Rabbit.installTool("BackgroundColor", {
  //   image: bg,
  //   tooling({ selectedElement, selection, range }) {
  //     // console.log(selection, selectedElement);
  //     const input = document.createElement("input");
  //     input.type = "color";
  //     input.addEventListener("change", (e) => {
  //       const color = (e.target! as HTMLInputElement).value;
  //       if (selectedElement) {
  //         if (selection) {
  //           if (selection === selectedElement.innerText) {
  //             if (selectedElement?.style.backgroundColor === color) {
  //               selectedElement!.style.backgroundColor = "unset";
  //             } else {
  //               selectedElement!.style.backgroundColor = color;
  //             }
  //           } else {
  //             const span = document.createElement("span");
  //             span.innerText = selection;
  //             span.style.color = color;
  //             range!.deleteContents();
  //             range!.insertNode(span);
  //           }
  //         }
  //       }
  //     });
  //     input.click();
  //   },
  // });
  // Rabbit.installTool("Asset", {
  //   image: add,
  //   tooling() {
  //     Rabbit.showModal("assets");
  //   },
  // });
  Rabbit.installAction("paste", (e: any) => {
    e.preventDefault();
    const clipboardData =
      e.clipboardData ||
      (window as unknown as { clipboardData: object }).clipboardData;
    const text = clipboardData.getData("text/plain");
    const file = clipboardData.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target!.result as string;
        if (Rabbit.selectedElement) {
          Rabbit.selectedElement?.insertAdjacentElement("afterend", img);
        } else {
          Rabbit._el!.appendChild(img);
        }
        // console.log({ sel: Rabbit.selectedElement });
      };
      reader.readAsDataURL(file);
    }
    // console.log({ text });
    if (text) {
      if (Rabbit.selectedElement && !Rabbit.selectedElement.innerText.trim()) {
        Rabbit.selectedElement.innerText = text as string; //.replace(/\n/g, "");
      } else {
        const p = document.createElement("p");
        p.innerHTML = text as string;
        Rabbit.selectedElement?.insertAdjacentElement("afterend", p);
        Rabbit._el!.appendChild(p);
      }
    }
    Rabbit._el?.focus();
  });
  Rabbit.installAction("click", async (e: any) => {
    const element = e.target as HTMLElement;
    if (element.tagName === "IMG") {
      Rabbit.showModal("image-tool", element);
    }
  });
  Rabbit.installModalTool("link", [
    ({ selection, range }) => {
      if (!Rabbit.selection) {
        return;
      }
      return me(
        "div",
        { className: "flex-y mw" },
        me(
          "div",
          { className: "flex-x mw flex-cx" },
          me("span"),
          me("img", {
            style: { width: "24px" },
            src: "/rabbit_assets/x.png",
            onclick() {
              Rabbit.hideModal();
            },
          })
        ),
        me("input", { placeholder: "input link here", id: "link-input" }),
        me(
          "button",
          {
            className: "btn",
            onclick() {
              const url = u<HTMLInputElement>("#link-input")!.value;
              if (url) {
                const link = document.createElement("a");
                link.href = url;
                link.textContent = selection;
                range!.deleteContents();
                range!.insertNode(link);
              }
              Rabbit.hideModal();
            },
          },
          "Done"
        )
      );
    },
  ]);
  Rabbit.installModalTool("image-tool", [
    (image) => {
      const wv = image.style.width.slice(0, -2);
      const hv = image.style.height.slice(0, -2);
      if (image.parentElement.id !== "pub") {
        image.parentElement!.insertAdjacentElement("afterend", image);
      }
      return me(
        "div",
        { className: "flex-y mw" },
        me(
          "div",
          { className: "flex-x mw flex-cx" },
          me("span"),
          me("img", {
            style: { width: "17px" },
            src: "/rabbit_assets/x.png",
            onclick() {
              Rabbit.hideModal();
            },
          })
        ),
        me("span", "select width"),
        me(
          "div",
          me<HTMLInputElement>("input", {
            type: "range",
            min: "100",
            max: "500",
            step: "50",
            value: wv,
            onchange() {
              // @ts-ignore
              const value = this.value;
              ref.E("wv-span")!.innerText = value + " px";
              image.style.width = value + "px";
            },
          }),
          me("span", { ref: ref.setAs("wv-span") }, wv ? wv + "px" : "300px")
        ),
        me("span", "select height"),
        me(
          "div",
          me<HTMLInputElement>("input", {
            type: "range",
            min: "100",
            max: "500",
            step: "50",
            value: hv,
            onchange() {
              // @ts-ignore
              const value = this.value;
              ref.E("hv-span")!.innerText = value + " px";
              image.style.height = value + "px";
              // console.log();
            },
          }),
          me("span", { ref: ref.setAs("hv-span") }, hv ? hv + "px" : "300px")
        ),
        me(
          "div",
          // {
          //   className: "",
          // },
          me("img", {
            style: { width: "1.7rem" },
            src: "/rabbit_assets/ad.png",
            onclick() {
              image.previousElementSibling?.insertAdjacentElement(
                "beforebegin",
                image
              );
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: {
              width: "2.7rem",
              opacity: image.style.alignSelf === "flex-start" ? "1" : "0.6",
            },
            src: "/rabbit_assets/left.png",
            onclick() {
              image.style.margin = "0px";
              image.style.alignSelf = "flex-start";
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: {
              width: "2.7rem",
              opacity: image.style.margin === "0px auto" ? "1" : "0.6",
            },
            src: "/rabbit_assets/senter.png",
            onclick() {
              image.style.alignSelf = "unset";
              image.style.margin = "0px auto";
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: {
              width: "2.7rem",
              opacity: image.style.alignSelf === "flex-end" ? "1" : "0.6",
            },
            src: "/rabbit_assets/right.png",
            onclick() {
              image.style.margin = "0px";
              image.style.alignSelf = "flex-end";
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: { width: "1.7rem" },
            src: "/rabbit_assets/au.png",
            onclick() {
              image.nextElementSibling?.insertAdjacentElement(
                "afterend",
                image
              );
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: { width: "1.7rem" },
            src: "/rabbit_assets/bin.png",
            onclick() {
              image.remove();
              Rabbit.hideModal();
            },
          })
        )
      );
    },
  ]);
  Rabbit.installModalTool("text-setting", [
    (element: HTMLParagraphElement) => {
      // console.log(element);
      return me(
        "div",
        { className: "flex-y mw" },
        me(
          "div",
          { className: "flex-x mw flex-cx" },
          me("span"),
          me("img", {
            style: { width: "17px" },
            src: "/rabbit_assets/x.png",
            onclick() {
              Rabbit.hideModal();
            },
          })
        ),
        me(
          "div",
          { className: "flex-y" },
          me(
            "h3",
            {
              onclick() {
                //  const url = u<HTMLInputElement>("#link-input")!.value;
                //  if (url) {
                const span = document.createElement("span");
                span.style.fontWeight = "bold";
                span.textContent = Rabbit.selection;
                // console.log(Rabbit.selectedElement);
                // console.log(Range);
                Rabbit.range!.deleteContents();
                Rabbit.range!.insertNode(span);
                //  }
                //  Rabbit.hideModal();
                // if (element.style.fontWeight !== "bold") {
                //   element.style.fontWeight = "bold";
                // } else {
                //   element.style.fontWeight = "unset";
                // }
              },
            },
            "Bold"
          ),
          me(
            "h3",
            {
              style: {
                opacity: element.style.fontSize === "30px" ? "1" : "0.6",
              },
              onclick(this: any) {
                if (element.style.fontSize !== "30px") {
                  element.style.fontSize = "30px";
                  this.style.opacity = "1";
                } else {
                  this.style.opacity = "0.6";
                  element.style.fontSize = "unset";
                }
              },
            },
            "Main Header"
          ),
          me(
            "h3",
            {
              style: {
                opacity: element.style.fontSize === "22px" ? "1" : "0.6",
              },
              onclick(this: any) {
                if (element.style.fontSize !== "22px") {
                  element.style.fontSize = "22px";
                  this.style.opacity = "1";
                } else {
                  this.style.opacity = "0.6";
                  element.style.fontSize = "unset";
                }
              },
            },
            "Small Header"
          ),
          me(
            "h3",
            {
              style: {
                opacity: element.style.fontSize === "16px" ? "1" : "0.6",
              },
              onclick(this: any) {
                if (element.style.fontSize !== "16px") {
                  element.style.fontSize = "16px";
                  this.style.opacity = "1";
                } else {
                  this.style.opacity = "0.6";
                  element.style.fontSize = "unset";
                }
              },
            },
            "Normal"
          ),
          me(
            "h3",
            {
              style: {
                opacity: element.style.fontStyle === "italic" ? "1" : "0.6",
              },
              onclick(this: any) {
                if (element.style.fontStyle !== "italic") {
                  element.style.fontStyle = "italic";
                  this.style.opacity = "1";
                } else {
                  element.style.fontStyle = "unset";
                  this.style.opacity = "0.6";
                }
              },
            },
            "Italic"
          ),
          me(
            "h3",
            {
              style: {
                opacity:
                  element.style.textDecoration === "underline" ? "1" : "0.6",
              },
              onclick(this: any) {
                if (element.style.textDecoration !== "underline") {
                  element.style.textDecoration = "underline";
                  this.style.opacity = "1";
                } else {
                  element.style.textDecoration = "unset";
                  this.style.opacity = "0.6";
                }
              },
            },
            "Underline"
          ),
          me(
            "h3",
            {
              style: {
                opacity:
                  element.style.textDecoration === "line-through" ? "1" : "0.6",
              },
              onclick(this: any) {
                if (element.style.textDecoration !== "line-through") {
                  element.style.textDecoration = "line-through";
                  this.style.opacity = "1";
                } else {
                  element.style.textDecoration = "unset";
                  this.style.opacity = "0.6";
                }
              },
            },
            "Strike"
          )
        ),
        me(
          "div",
          {
            className: "flex-fl",
          },
          me("img", {
            style: { width: "1.7rem" },
            src: "/rabbit_assets/ad.png",
            onclick() {
              element.previousElementSibling?.insertAdjacentElement(
                "beforebegin",
                element
              );
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: {
              width: "1.7rem",
              opacity: element.style.textAlign === "start" ? "1" : "0.6",
            },
            src: "/rabbit_assets/left.png",
            onclick() {
              element.style.textAlign = "start";
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: {
              width: "1.7rem",
              opacity: element.style.textAlign === "center" ? "1" : "0.6",
            },
            src: "/rabbit_assets/senter.png",
            onclick() {
              element.style.textAlign = "center";
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: {
              width: "1.7rem",
              opacity: element.style.textAlign === "end" ? "1" : "0.6",
            },
            src: "/rabbit_assets/right.png",
            onclick() {
              element.style.textAlign = "end";
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: { width: "1.7rem" },
            src: "/rabbit_assets/au.png",
            onclick() {
              element.nextElementSibling?.insertAdjacentElement(
                "afterend",
                element
              );
              Rabbit.hideModal();
            },
          }),
          me("img", {
            style: { width: "1.7rem" },
            src: "/rabbit_assets/bin.png",
            onclick() {
              element.remove();
              Rabbit.hideModal();
            },
          })
        )
      );
    },
  ]);
  // last  }
};