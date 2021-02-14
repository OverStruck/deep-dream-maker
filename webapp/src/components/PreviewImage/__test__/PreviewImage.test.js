import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import PreviewImage from "../PreviewImage"
import fakeData from "./fakeFetch";

describe("Preview Image", () => {
    let fakeProps, mockCallback, ref;
    beforeEach(() => {
        ref = React.createRef();
        mockCallback = jest.fn();
        fakeProps = {
            run: false,
            onLog: mockCallback
        }
        render(<PreviewImage ref={ref} {...fakeProps} />);
    })
    it("renders properly", () => {
        expect(screen.getByRole("img")).toBeInTheDocument();
        //verify callback is never called
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it("sets image background image url", () => {
        //let image = new File(["(⌐■_■)"], "deepdream.png", { type: "image/png" });
        ref.current.setImage("deepdream.png");
        expect(screen.getByRole("img")).toHaveStyle("background-image: url(deepdream.png)");
    });
});

describe("Preview Image Fetching", () => {
    let fakeApi, fakeProps, mockCallback;
    beforeEach(() => {
        //setup fake data api
        fakeApi = new fakeData();
        //setup fake fetch
        jest.spyOn(window, "fetch");
        window.fetch.mockImplementation(url => fakeApi.fetch(url));
        window.URL.createObjectURL = function (data) { return fakeApi.createObjectURL(data) };

        mockCallback = jest.fn();
        fakeProps = {
            run: false,
            onLog: mockCallback
        }

        const { rerender } = render(<PreviewImage {...fakeProps} />);
        jest.useFakeTimers();
        fakeProps.run = true;
        rerender(<PreviewImage {...fakeProps} />);
    });

    it("fetches 1 image", async () => {
        const imageContainer = screen.getByRole("img");
        //make time pass
        jest.advanceTimersByTime(200);
        expect(mockCallback).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1000);
        await waitFor(() => expect(imageContainer).toHaveStyle(`background-image: url(${fakeApi.getUrl(0)})`));
        jest.clearAllTimers();
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("fetches multiple images", async () => {
        const imageContainer = screen.getByRole("img");
        //simulate fetching images
        for (let i = 0; i < 4; i++) {
            jest.advanceTimersByTime(1000);
            //allow any pending jobs in the PromiseJobs queue to run
            await Promise.resolve();
        }
        await waitFor(() => expect(imageContainer).toHaveStyle(`background-image: url(${fakeApi.getUrl(3)})`));
        expect(mockCallback).toHaveBeenCalledTimes(4);
        jest.clearAllTimers();
    });

    it("properly ends fetching images", async () => {
        const spyStop = jest.spyOn(PreviewImage.prototype, "stop");
        const imageContainer = screen.getByRole("img");
        //simulate fetching images (6 seconds)
        for (let i = 0; i < 6; i++) {
            jest.advanceTimersByTime(1000);
            //allow any pending jobs in the PromiseJobs queue to run
            await Promise.resolve();
        }
        await waitFor(() => expect(imageContainer).toHaveStyle(`background-image: url(${fakeApi.getUrl(3)})`));
        expect(spyStop).toHaveBeenCalledTimes(1);
        jest.clearAllTimers();
    });
});