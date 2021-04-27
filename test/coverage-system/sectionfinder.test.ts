import * as assert from "assert";
import { Section } from "lcov-parse";
import { basename, join } from "path";
import { TextEditor, Uri, workspace, WorkspaceFolder } from "vscode";

import { SectionFinder } from "../../src/coverage-system/sectionfinder";
import { fakeConfig } from "../mocks/fakeConfig";

const getWorkspaceFolder = workspace.getWorkspaceFolder;

suite("SectionFinder Tests", function() {
    teardown(function() {
        (workspace as any).getWorkspaceFolder = getWorkspaceFolder;
    });

    const fakeOutput = {
        append: () => {},
        appendLine: () => {},
        clear: () => {},
        dispose: () => {},
        hide: () => {},
        name: "fake",
        show: () => {},
    };
    const filename = "test123.ts";
    const title = `00-${filename}`;
    const testFolderPath = "/path/to/test/folder";
    const filePath = join(testFolderPath, "test123.ts");
    const testWorkspaceFolder: WorkspaceFolder = {
        index: 0,
        name: basename(testFolderPath),
        uri: Uri.file(testFolderPath),
    };
    const textEditor: TextEditor = {} as TextEditor;
    (textEditor as any).document = {};
    (textEditor as any).document.fileName = filePath;
    const sectionMap: Map<string, Section> = new Map<string, Section>([
        [
            `${title}::${filePath}`,
            {
                file: filePath,
                functions: {
                    details: [],
                    found: 0,
                    hit: 0,
                },
                lines: {
                    details: [],
                    found: 0,
                    hit: 0,
                },
                title,
            },
        ],
    ]);
    const sectionFinder: SectionFinder = new SectionFinder(
        fakeConfig,
        fakeOutput,
    );
    const createWorkspaceFolderMock = (workspaceFolder: WorkspaceFolder): (uri: Uri) => WorkspaceFolder => {
        return (uri: Uri): WorkspaceFolder => {
            if (uri.path === textEditor.document.fileName) {
                return workspaceFolder;
            }

            throw new Error("Invalid filename given");
        };
    };

    test("Should handle workspace folders without names", function(done) {
        (workspace as any).getWorkspaceFolder = createWorkspaceFolderMock(testWorkspaceFolder);
        const sections = sectionFinder.findSectionsForEditor(
            textEditor,
            sectionMap,
        );

        assert.equal(sections.length, 1);
        return done();
    });

    test("Should handle workspace folders with names", function(done) {
        const workspaceFolderWithName: WorkspaceFolder = {
            ...testWorkspaceFolder,
            name: "Test Folder",
        };
        (workspace as any).getWorkspaceFolder = createWorkspaceFolderMock(workspaceFolderWithName);
        const sections = sectionFinder.findSectionsForEditor(
            textEditor,
            sectionMap,
        );

        assert.equal(sections.length, 1);
        return done();
    });
});
