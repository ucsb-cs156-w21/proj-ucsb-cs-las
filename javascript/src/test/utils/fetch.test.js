import { fetchWithToken, fetchWithoutToken } from "main/utils/fetch";
import unfetch from "isomorphic-unfetch";
jest.mock("isomorphic-unfetch");

describe("fetch tests", () => {
  describe("fetchWithToken", () => {
    const getToken = jest.fn();
    beforeEach(() => {
      unfetch.mockResolvedValue({
        status: 200,
        json: () => {
          return {};
        },
      });
      getToken.mockResolvedValue("token");
    });
    test("should fetch good response", async () => {
      const response = await fetchWithToken("/api/test", getToken);

      expect(getToken).toHaveBeenCalledTimes(1);
      expect(unfetch).toHaveBeenCalledTimes(1);
      expect(response).toEqual({});
    });

    test("should not call json when noJSON is passed", async () => {
      const jsonSpy = jest.fn();
      unfetch.mockResolvedValueOnce({
        status: 200,
        json: jsonSpy,
      });
      const _response = await fetchWithToken("/api/test", getToken, {
        noJSON: true,
      });
      expect(jsonSpy).toHaveBeenCalledTimes(0);
    });

    test("should throw an error when error code is between 400 and 600", async () => {
      unfetch.mockResolvedValueOnce({
        status: 500,
        error_description: "error",
      });
      expect(fetchWithToken("/api/test", getToken)).rejects.toEqual(
        new Error("error")
      );
    });
  });

  describe("fetchWithoutToken", () => {
    beforeEach(() => {
      unfetch.mockResolvedValue({
        status: 200,
        json: () => {
          return {};
        },
      });
    });

    test("should fetch good response", async () => {
      const response = await fetchWithoutToken("/api/test");
      expect(unfetch).toHaveBeenCalledTimes(1);
      expect(response).toEqual({});
    });

      test("should not call json when noJSON is passed", async () => {
        const jsonSpy = jest.fn();
        unfetch.mockResolvedValueOnce({
          status: 200,
          json: jsonSpy,
        });
        const _response = await fetchWithoutToken("/api/test",  {
          noJSON: true,
        });
        expect(jsonSpy).toHaveBeenCalledTimes(0);
      });

      test("should throw an error when error code is between 400 and 600", async () => {
        unfetch.mockResolvedValueOnce({
          status: 500,
          error_description: "error",
        });
        expect(fetchWithoutToken("/api/test")).rejects.toEqual(
          new Error("error")
        );
      });

  });


});
