-- 1. Create the Main Tree Table
CREATE TABLE Trees (
    TreeID INT PRIMARY KEY IDENTITY(1,1),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Create the Recursive Tags Table
CREATE TABLE Tags (
    TagID INT PRIMARY KEY IDENTITY(1,1),
    TreeID INT NOT NULL,
    ParentID INT NULL, -- Self-reference for nesting
    TagName NVARCHAR(255) NOT NULL,
    TagData NVARCHAR(MAX) NULL, -- Will be NULL if the tag has children
    CONSTRAINT FK_Tags_Tree FOREIGN KEY (TreeID) REFERENCES Trees(TreeID) ON DELETE CASCADE,
    CONSTRAINT FK_Tags_Parent FOREIGN KEY (ParentID) REFERENCES Tags(TagID)
);

-- Indexing for recursive performance
CREATE INDEX IX_Tags_TreeID ON Tags(TreeID);
CREATE INDEX IX_Tags_ParentID ON Tags(ParentID);
GO


