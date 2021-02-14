import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import ProgressBar from "./ProgressBar"

describe("Progress Bar", () => {
    let mockCallback, fakeProps;
    beforeEach(() => {
        jest.spyOn(window, 'fetch');
        mockCallback = jest.fn();
        fakeProps = {
            run: false,
            onFinish: mockCallback
        }
    });

    it("renders properly on fresh start", () => {
        render(<ProgressBar {...fakeProps} />);
        const pBar = screen.getByRole("progressbar");
        //verify progress=0
        expect(pBar).toHaveAttribute("aria-valuenow", "0");
        //verify callback is never called
        expect(mockCallback).not.toHaveBeenCalled();
    });

    it("runs until 100 percent", async () => {
        //fake fetch
        async function mockFetch() {
            return {
                ok: true,
                status: 200,
                json: async () => ({ progress: 100 }),
            }
        }
        //setup fake fetch
        window.fetch.mockImplementation(mockFetch);
        jest.useFakeTimers();
        //render fresh component
        const { rerender } = render(<ProgressBar {...fakeProps} />);
        const pBar = screen.getByRole("progressbar");
        // re-render with different props
        // on run=true the progress bar component should start fetching data
        fakeProps.run = true;
        rerender(<ProgressBar {...fakeProps} />);
        //advance time to 200ms, this is when the call to fetch should happen
        jest.advanceTimersByTime(200);
        // turn "off" the progress bar
        // at this point progress should be 100
        fakeProps.run = false;
        rerender(<ProgressBar {...fakeProps} />);
        //verify the progress bar has value of 100
        await waitFor(() => expect(pBar).toHaveAttribute("aria-valuenow", "100"));
        jest.clearAllTimers();
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("renders properly from progress = 0 to 99", async () => {
        //fake fetch
        let testProgress = 0
        async function mockFetch() {
            return {
                ok: true,
                status: 200,
                json: async () => ({ progress: ++testProgress }),
            }
        }
        //setup fake fetch
        window.fetch.mockImplementation(mockFetch);

        jest.useFakeTimers();
        //render fresh component
        const { rerender } = render(<ProgressBar {...fakeProps} />);
        const pBar = screen.getByRole("progressbar");
        // re-render with different props
        // on run=true the progress bar component should start fetching data
        fakeProps.run = true;
        rerender(<ProgressBar {...fakeProps} />);
        //simulate progress bar fetching data
        for (let i = 0; i < 99; i++) {
            jest.advanceTimersByTime(200);
            //allow any pending jobs in the PromiseJobs queue to run
            await Promise.resolve();
        }
        // turn "off" the progress bar
        // at this point progress should be 100
        fakeProps.run = false;
        rerender(<ProgressBar {...fakeProps} />);
        //verify the progress bar has value of 99
        await waitFor(() => expect(pBar).toHaveAttribute("aria-valuenow", "99"));
        jest.clearAllTimers();
        expect(mockCallback).not.toHaveBeenCalled();
    })
});