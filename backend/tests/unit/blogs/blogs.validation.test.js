import { describe, it, expect } from "vitest";

import {
  createBlogSchema,
  updateBlogSchema,
  blogQuerySchema,
  createTaxonomySchema,
  blogParamSchema,
  blogSlugParamSchema,
  blogPreviewTokenParamSchema,
} from "../../../src/modules/blogs/blogs.validation.js";

// Valid classic CUID for tests.
const validCuid = "cjld2cjxh0000qzrmn831i7rn";
const validToken = "a".repeat(64);

const validBlog = {
  title: "A Complete Blog Title",
};

const validTextBlock = {
  type: "paragraph",
  data: {
    content: "Hello world",
  },
};

const validMediaBlock = {
  type: "image",
  data: {
    url: "https://example.com/image.jpg",
    caption: "Example image",
  },
};

function expectValid(schema, input) {
  const result = schema.safeParse(input);
  expect(result.success).toBe(true);
  return result;
}

function expectInvalid(schema, input) {
  const result = schema.safeParse(input);
  expect(result.success).toBe(false);
  return result;
}

// createBlogSchema

describe("createBlogSchema", () => {
  describe("title", () => {
    it("accepts a valid title", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        title: "My First Blog",
      });
    });

    it("rejects a missing title", () => {
      expectInvalid(createBlogSchema, {});
    });

    it("rejects a non-string title", () => {
      expectInvalid(createBlogSchema, {
        title: 12345,
      });
    });

    it("trims leading and trailing whitespace", () => {
      const result = expectValid(createBlogSchema, {
        title: "  My Blog Title  ",
      });

      expect(result.data.title).toBe("My Blog Title");
    });

    it("rejects a title shorter than five characters after trimming", () => {
      expectInvalid(createBlogSchema, {
        title: " ab ",
      });
    });

    it("accepts a title of exactly five characters", () => {
      expectValid(createBlogSchema, {
        title: "Hello",
      });
    });

    it("accepts a title of exactly 200 characters", () => {
      expectValid(createBlogSchema, {
        title: "a".repeat(200),
      });
    });

    it("rejects a title longer than 200 characters", () => {
      expectInvalid(createBlogSchema, {
        title: "a".repeat(201),
      });
    });

    it("rejects a whitespace-only title", () => {
      expectInvalid(createBlogSchema, {
        title: "     ",
      });
    });
  });

  describe("slug", () => {
    it("accepts a valid slug", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        slug: "my-first-blog-123",
      });
    });

    it("trims and converts a slug to lowercase", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        slug: "  MY-FIRST-BLOG  ",
      });

      expect(result.data.slug).toBe("my-first-blog");
    });

    it("allows an omitted slug", () => {
      expectValid(createBlogSchema, validBlog);
    });

    it("allows a null slug", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        slug: null,
      });
    });

    it("currently accepts an empty slug", () => {
      // The regex permits zero characters.
      expectValid(createBlogSchema, {
        ...validBlog,
        slug: "",
      });
    });

    it("rejects spaces inside a slug", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        slug: "my first blog",
      });
    });

    it("rejects underscores", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        slug: "my_first_blog",
      });
    });

    it("rejects special characters", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        slug: "my-blog!",
      });
    });

    it("accepts a slug of exactly 150 characters", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        slug: "a".repeat(150),
      });
    });

    it("rejects a slug longer than 150 characters", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        slug: "a".repeat(151),
      });
    });
  });

  describe("excerpt", () => {
    it("accepts a valid excerpt", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        excerpt: "A short blog description",
      });
    });

    it("allows an omitted excerpt", () => {
      expectValid(createBlogSchema, validBlog);
    });

    it("allows a null excerpt", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        excerpt: null,
      });
    });

    it("allows an empty excerpt", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        excerpt: "",
      });
    });

    it("trims excerpt whitespace", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        excerpt: "  A description  ",
      });

      expect(result.data.excerpt).toBe("A description");
    });

    it("accepts exactly 1000 characters", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        excerpt: "a".repeat(1000),
      });
    });

    it("rejects more than 1000 characters", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        excerpt: "a".repeat(1001),
      });
    });

    it("rejects a non-string excerpt", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        excerpt: 123,
      });
    });
  });

  describe("content and content blocks", () => {
    it("defaults omitted content to an empty blocks array", () => {
      const result = expectValid(createBlogSchema, validBlog);

      expect(result.data.content).toEqual({
        blocks: [],
      });
    });

    it("defaults omitted blocks to an empty array", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {},
      });

      expect(result.data.content.blocks).toEqual([]);
    });

    it("accepts an empty blocks array", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [],
        },
      });
    });

    it("accepts valid text blocks", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            { type: "richText", data: { content: "Text" } },
            { type: "heading", data: { content: "Heading" } },
            { type: "paragraph", data: { content: "Paragraph" } },
            { type: "quote", data: { content: "Quote" } },
          ],
        },
      });
    });

    it("accepts a divider block", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "divider",
              data: {},
            },
          ],
        },
      });
    });

    it("defaults divider data to an empty object", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "divider",
            },
          ],
        },
      });

      expect(result.data.content.blocks[0].data).toEqual({});
    });

    it("accepts an image block", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [validMediaBlock],
        },
      });
    });

    it("accepts a video block with an allowed platform", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "video",
              data: {
                url: "https://example.com/video",
                platform: "youtube",
                videoId: "abc123",
              },
            },
          ],
        },
      });
    });

    it.each(["youtube", "vimeo"])(
      "accepts the video platform %s",
      (platform) => {
        expectValid(createBlogSchema, {
          ...validBlog,
          content: {
            blocks: [
              {
                type: "video",
                data: { platform },
              },
            ],
          },
        });
      },
    );

    it("rejects an unsupported video platform", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "video",
              data: {
                platform: "dailymotion",
              },
            },
          ],
        },
      });
    });

    it("defaults gallery images to an empty array", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "gallery",
            },
          ],
        },
      });

      expect(result.data.content.blocks[0].data.images).toEqual([]);
    });

    it("accepts a gallery containing image URLs", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "gallery",
              data: {
                images: [
                  "https://example.com/one.jpg",
                  "https://example.com/two.jpg",
                ],
              },
            },
          ],
        },
      });
    });

    it("rejects non-string gallery items", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "gallery",
              data: {
                images: ["https://example.com/image.jpg", 123],
              },
            },
          ],
        },
      });
    });

    it("rejects a non-array blocks value", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: "not-an-array",
        },
      });
    });

    it("rejects an unsupported block type", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "table",
              data: {},
            },
          ],
        },
      });
    });

    it("rejects a block with no type", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              data: {},
            },
          ],
        },
      });
    });

    it("rejects a text block with an invalid data type", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "paragraph",
              data: "invalid",
            },
          ],
        },
      });
    });

    it("defaults text block content to an empty string", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "paragraph",
              data: {},
            },
          ],
        },
      });

      expect(result.data.content.blocks[0].data.content).toBe("");
    });

    it("trims text block content", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              ...validTextBlock,
              data: {
                content: "  Hello world  ",
              },
            },
          ],
        },
      });

      expect(result.data.content.blocks[0].data.content).toBe(
        "Hello world",
      );
    });

    it("rejects non-string text block content", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "paragraph",
              data: {
                content: 123,
              },
            },
          ],
        },
      });
    });

    it("accepts extra properties inside text block data", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "paragraph",
              data: {
                content: "Hello",
                editorMetadata: {
                  alignment: "center",
                },
              },
            },
          ],
        },
      });

      expect(
        result.data.content.blocks[0].data.editorMetadata,
      ).toEqual({
        alignment: "center",
      });
    });

    it("accepts a media caption up to 300 characters", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "image",
              data: {
                caption: "a".repeat(300),
              },
            },
          ],
        },
      });
    });

    it("rejects a media caption longer than 300 characters", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "image",
              data: {
                caption: "a".repeat(301),
              },
            },
          ],
        },
      });
    });

    it("allows a null media caption", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "image",
              data: {
                caption: null,
              },
            },
          ],
        },
      });
    });

    it("defaults an omitted media URL to an empty string", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "image",
              data: {},
            },
          ],
        },
      });

      expect(result.data.content.blocks[0].data.url).toBe("");
    });

    it("rejects a non-string media URL", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        content: {
          blocks: [
            {
              type: "image",
              data: {
                url: 123,
              },
            },
          ],
        },
      });
    });
  });

  describe("status and boolean fields", () => {
    it.each(["DRAFT", "PUBLISHED", "SCHEDULED"])(
      "accepts status %s",
      (status) => {
        expectValid(createBlogSchema, {
          ...validBlog,
          status,
        });
      },
    );

    it("defaults status to DRAFT", () => {
      const result = expectValid(createBlogSchema, validBlog);
      expect(result.data.status).toBe("DRAFT");
    });

    it("rejects ARCHIVED on create", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        status: "ARCHIVED",
      });
    });

    it("rejects an unknown status", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        status: "UNKNOWN",
      });
    });

    it("defaults isFeatured to false", () => {
      const result = expectValid(createBlogSchema, validBlog);
      expect(result.data.isFeatured).toBe(false);
    });

    it("defaults includeInSitemap to true", () => {
      const result = expectValid(createBlogSchema, validBlog);
      expect(result.data.includeInSitemap).toBe(true);
    });

    it("defaults noIndex and noFollow to false", () => {
      const result = expectValid(createBlogSchema, validBlog);

      expect(result.data.noIndex).toBe(false);
      expect(result.data.noFollow).toBe(false);
    });

    it.each([
      "isFeatured",
      "includeInSitemap",
      "noIndex",
      "noFollow",
    ])("rejects a string value for %s", (field) => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        [field]: "false",
      });
    });

    it.each([
      "isFeatured",
      "includeInSitemap",
      "noIndex",
      "noFollow",
    ])("rejects a numeric value for %s", (field) => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        [field]: 1,
      });
    });
  });

  describe("categoryIds and tagIds", () => {
    it("defaults categoryIds and tagIds to empty arrays", () => {
      const result = expectValid(createBlogSchema, validBlog);

      expect(result.data.categoryIds).toEqual([]);
      expect(result.data.tagIds).toEqual([]);
    });

    it("accepts valid category and tag IDs", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        categoryIds: [validCuid],
        tagIds: [validCuid],
      });
    });

    it("accepts empty category and tag arrays", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        categoryIds: [],
        tagIds: [],
      });
    });

    it("rejects invalid category IDs", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        categoryIds: ["not-a-cuid"],
      });
    });

    it("rejects invalid tag IDs", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        tagIds: ["not-a-cuid"],
      });
    });

    it("rejects an array containing both valid and invalid IDs", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        categoryIds: [validCuid, "invalid-id"],
      });
    });

    it("rejects a string instead of a category array", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        categoryIds: validCuid,
      });
    });

    it("rejects a non-string array item", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        tagIds: [123],
      });
    });
  });

  describe("featuredImageId and publishedAt", () => {
    it("accepts a valid featured image ID", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        featuredImageId: validCuid,
      });
    });

    it("allows a null featured image ID", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        featuredImageId: null,
      });
    });

    it("rejects an invalid featured image ID", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        featuredImageId: "invalid-id",
      });
    });

    it("rejects an empty featured image ID", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        featuredImageId: "",
      });
    });

    it("accepts an ISO datetime", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        publishedAt: "2026-10-10T10:30:00Z",
      });
    });

    it("allows null publishedAt", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        publishedAt: null,
      });
    });

    it("rejects an invalid datetime", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        publishedAt: "not-a-date",
      });
    });

    it("rejects a date-only string", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        publishedAt: "2026-10-10",
      });
    });

    it("rejects a numeric timestamp", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        publishedAt: 1791630000000,
      });
    });
  });

  describe("SEO fields", () => {
    const stringFields = [
      ["metaTitle", 150],
      ["metaDescription", 500],
      ["metaKeywords", 300],
      ["ogTitle", 150],
      ["ogDescription", 500],
    ];

    it.each(stringFields)(
      "accepts %s at its maximum length",
      (field, maxLength) => {
        expectValid(createBlogSchema, {
          ...validBlog,
          [field]: "a".repeat(maxLength),
        });
      },
    );

    it.each(stringFields)(
      "rejects %s beyond its maximum length",
      (field, maxLength) => {
        expectInvalid(createBlogSchema, {
          ...validBlog,
          [field]: "a".repeat(maxLength + 1),
        });
      },
    );

    it.each(stringFields)(
      "allows null for %s",
      (field) => {
        expectValid(createBlogSchema, {
          ...validBlog,
          [field]: null,
        });
      },
    );

    it.each(stringFields)(
      "trims whitespace for %s",
      (field) => {
        const result = expectValid(createBlogSchema, {
          ...validBlog,
          [field]: "  SEO value  ",
        });

        expect(result.data[field]).toBe("SEO value");
      },
    );

    it("accepts a valid canonical URL", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        canonicalUrl: "https://example.com/blog",
      });
    });

    it("accepts an empty canonical URL", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        canonicalUrl: "",
      });
    });

    it("allows a null canonical URL", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        canonicalUrl: null,
      });
    });

    it("rejects an invalid canonical URL", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        canonicalUrl: "not-a-url",
      });
    });

    it("rejects a whitespace-only canonical URL", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        canonicalUrl: "   ",
      });
    });

    it("accepts a valid OG image ID", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        ogImageId: validCuid,
      });
    });

    it("allows an empty OG image ID", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        ogImageId: "",
      });
    });

    it("allows a null OG image ID", () => {
      expectValid(createBlogSchema, {
        ...validBlog,
        ogImageId: null,
      });
    });

    it("rejects an invalid OG image ID", () => {
      expectInvalid(createBlogSchema, {
        ...validBlog,
        ogImageId: "invalid-id",
      });
    });
  });

  describe("unknown properties", () => {
    it("strips unknown top-level properties", () => {
      const result = expectValid(createBlogSchema, {
        ...validBlog,
        unexpectedField: "should not be retained",
      });

      expect(result.data).not.toHaveProperty("unexpectedField");
    });
  });
});

// updateBlogSchema

describe("updateBlogSchema", () => {
  it("accepts an empty update object", () => {
    expectValid(updateBlogSchema, {});
  });

  it("accepts a title-only update", () => {
    const result = expectValid(updateBlogSchema, {
      title: "Updated Blog Title",
    });

    expect(result.data.title).toBe("Updated Blog Title");
  });

  it("accepts ARCHIVED status on update", () => {
    expectValid(updateBlogSchema, {
      status: "ARCHIVED",
    });
  });

  it.each(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"])(
    "accepts status %s",
    (status) => {
      expectValid(updateBlogSchema, { status });
    },
  );

  it("rejects an unknown update status", () => {
    expectInvalid(updateBlogSchema, {
      status: "UNKNOWN",
    });
  });

  it("still validates title length when supplied", () => {
    expectInvalid(updateBlogSchema, {
      title: "Tiny",
    });
  });

  it("still validates content blocks when supplied", () => {
    expectInvalid(updateBlogSchema, {
      content: {
        blocks: [
          {
            type: "unknown",
            data: {},
          },
        ],
      },
    });
  });

  it("still validates category IDs when supplied", () => {
    expectInvalid(updateBlogSchema, {
      categoryIds: ["invalid-id"],
    });
  });

  it("still validates tag IDs when supplied", () => {
    expectInvalid(updateBlogSchema, {
      tagIds: ["invalid-id"],
    });
  });

  it("allows an explicit empty category array", () => {
    const result = expectValid(updateBlogSchema, {
      categoryIds: [],
    });

    expect(result.data.categoryIds).toEqual([]);
  });

  it("allows an explicit null featured image", () => {
    const result = expectValid(updateBlogSchema, {
      featuredImageId: null,
    });

    expect(result.data.featuredImageId).toBeNull();
  });

  it("strips unknown update properties", () => {
    const result = expectValid(updateBlogSchema, {
      title: "Updated Blog Title",
      unknownField: "ignored",
    });

    expect(result.data).not.toHaveProperty("unknownField");
  });

  it("does not inject defaults for fields omitted from a PATCH payload", () => {
    const result = expectValid(updateBlogSchema, {
      title: "Updated Blog Title",
    });

    expect(result.data).toEqual({
      title: "Updated Blog Title",
    });
  });
});

// blogQuerySchema

describe("blogQuerySchema", () => {
  it("applies pagination and sorting defaults", () => {
    const result = expectValid(blogQuerySchema, {});

    expect(result.data).toMatchObject({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  });

  it("coerces page and limit strings to numbers", () => {
    const result = expectValid(blogQuerySchema, {
      page: "2",
      limit: "25",
    });

    expect(result.data.page).toBe(2);
    expect(result.data.limit).toBe(25);
  });

  it.each(["0", "-1", "1.5", "abc", ""])(
    "rejects invalid page value %s",
    (page) => {
      expectInvalid(blogQuerySchema, { page });
    },
  );

  it.each(["0", "101", "-5", "2.5", "abc", ""])(
    "rejects invalid limit value %s",
    (limit) => {
      expectInvalid(blogQuerySchema, { limit });
    },
  );

  it("accepts limit boundaries 1 and 100", () => {
    expectValid(blogQuerySchema, { limit: "1" });
    expectValid(blogQuerySchema, { limit: "100" });
  });

  it("trims search and taxonomy slugs", () => {
    const result = expectValid(blogQuerySchema, {
      search: "  nature  ",
      categorySlug: "  aquatic-plants  ",
      tagSlug: "  care  ",
    });

    expect(result.data.search).toBe("nature");
    expect(result.data.categorySlug).toBe("aquatic-plants");
    expect(result.data.tagSlug).toBe("care");
  });

  it.each(["DRAFT", "PUBLISHED", "ARCHIVED", "SCHEDULED"])(
    "accepts status %s",
    (status) => {
      expectValid(blogQuerySchema, { status });
    },
  );

  it("rejects an unsupported status", () => {
    expectInvalid(blogQuerySchema, {
      status: "UNKNOWN",
    });
  });

  it.each([
    "createdAt",
    "updatedAt",
    "publishedAt",
    "title",
    "viewCount",
  ])("accepts sortBy %s", (sortBy) => {
    expectValid(blogQuerySchema, { sortBy });
  });

  it("rejects an unsupported sortBy field", () => {
    expectInvalid(blogQuerySchema, {
      sortBy: "password",
    });
  });

  it.each(["asc", "desc"])("accepts sortOrder %s", (sortOrder) => {
    expectValid(blogQuerySchema, { sortOrder });
  });

  it("rejects an unsupported sortOrder", () => {
    expectInvalid(blogQuerySchema, {
      sortOrder: "random",
    });
  });

  it("currently coerces the string false to true with z.coerce.boolean()", () => {
    const result = expectValid(blogQuerySchema, {
      isFeatured: "false",
    });

    expect(result.data.isFeatured).toBe(true);
  });

  it("coerces the string true to true", () => {
    const result = expectValid(blogQuerySchema, {
      isFeatured: "true",
    });

    expect(result.data.isFeatured).toBe(true);
  });

  it("coerces an empty isFeatured string to false", () => {
    const result = expectValid(blogQuerySchema, {
      isFeatured: "",
    });

    expect(result.data.isFeatured).toBe(false);
  });

  it("allows isFeatured to be omitted", () => {
    const result = expectValid(blogQuerySchema, {});

    expect(result.data.isFeatured).toBeUndefined();
  });

  it("strips unknown query parameters", () => {
    const result = expectValid(blogQuerySchema, {
      page: "1",
      unexpectedFilter: "value",
    });

    expect(result.data).not.toHaveProperty("unexpectedFilter");
  });
});

// createTaxonomySchema

describe("createTaxonomySchema", () => {
  it("accepts a valid taxonomy name", () => {
    expectValid(createTaxonomySchema, {
      name: "Aquatic Plants",
    });
  });

  it("trims taxonomy names", () => {
    const result = expectValid(createTaxonomySchema, {
      name: "  Aquatic Plants  ",
    });

    expect(result.data.name).toBe("Aquatic Plants");
  });

  it("rejects a missing name", () => {
    expectInvalid(createTaxonomySchema, {});
  });

  it("rejects an empty name", () => {
    expectInvalid(createTaxonomySchema, {
      name: "",
    });
  });

  it("rejects a whitespace-only name", () => {
    expectInvalid(createTaxonomySchema, {
      name: "   ",
    });
  });

  it("accepts a one-character name", () => {
    expectValid(createTaxonomySchema, {
      name: "A",
    });
  });

  it("accepts a name of exactly 100 characters", () => {
    expectValid(createTaxonomySchema, {
      name: "a".repeat(100),
    });
  });

  it("rejects a name longer than 100 characters", () => {
    expectInvalid(createTaxonomySchema, {
      name: "a".repeat(101),
    });
  });

  it("rejects a non-string name", () => {
    expectInvalid(createTaxonomySchema, {
      name: 123,
    });
  });

  it("rejects unknown properties because the schema is strict", () => {
    expectInvalid(createTaxonomySchema, {
      name: "Aquatic Plants",
      slug: "aquatic-plants",
    });
  });
});

// blogParamSchema

describe("blogParamSchema", () => {
  it("accepts a valid CUID", () => {
    expectValid(blogParamSchema, {
      id: validCuid,
    });
  });

  it("rejects an invalid ID", () => {
    expectInvalid(blogParamSchema, {
      id: "invalid-id",
    });
  });

  it("rejects an empty ID", () => {
    expectInvalid(blogParamSchema, {
      id: "",
    });
  });

  it("rejects a missing ID", () => {
    expectInvalid(blogParamSchema, {});
  });

  it("rejects a numeric ID", () => {
    expectInvalid(blogParamSchema, {
      id: 123,
    });
  });
});

// blogSlugParamSchema

describe("blogSlugParamSchema", () => {
  it("accepts a valid slug", () => {
    expectValid(blogSlugParamSchema, {
      slug: "my-first-blog",
    });
  });

  it("rejects an empty slug", () => {
    expectInvalid(blogSlugParamSchema, {
      slug: "",
    });
  });

  it("rejects a missing slug", () => {
    expectInvalid(blogSlugParamSchema, {});
  });

  it("rejects a non-string slug", () => {
    expectInvalid(blogSlugParamSchema, {
      slug: 123,
    });
  });

  it("currently accepts a whitespace-only slug", () => {
    // The current schema only uses z.string().min(1), without trim().
    expectValid(blogSlugParamSchema, {
      slug: "   ",
    });
  });
});

// blogPreviewTokenParamSchema

describe("blogPreviewTokenParamSchema", () => {
  it("accepts a token of exactly 64 characters", () => {
    expectValid(blogPreviewTokenParamSchema, {
      token: validToken,
    });
  });

  it("rejects a token shorter than 64 characters", () => {
    expectInvalid(blogPreviewTokenParamSchema, {
      token: "a".repeat(63),
    });
  });

  it("rejects a token longer than 64 characters", () => {
    expectInvalid(blogPreviewTokenParamSchema, {
      token: "a".repeat(65),
    });
  });

  it("rejects a missing token", () => {
    expectInvalid(blogPreviewTokenParamSchema, {});
  });

  it("rejects an empty token", () => {
    expectInvalid(blogPreviewTokenParamSchema, {
      token: "",
    });
  });

  it("rejects a non-string token", () => {
    expectInvalid(blogPreviewTokenParamSchema, {
      token: 123,
    });
  });

  it("currently validates token length but not hexadecimal characters", () => {
    expectValid(blogPreviewTokenParamSchema, {
      token: "z".repeat(64),
    });
  });
});