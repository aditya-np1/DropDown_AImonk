CREATE OR ALTER PROCEDURE sp_UpdateTreeData
    @TreeID INT,
    @TagName NVARCHAR(255),
    @TagData NVARCHAR(MAX) = NULL,
    @TagID INT = NULL,
    @ParentID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- If TagID is NULL or 0, we perform an INSERT
    IF @TagID IS NULL OR @TagID = 0
    BEGIN
        INSERT INTO [dbo].[Tags] (TreeID, TagName, TagData, ParentID)
        VALUES (@TreeID, @TagName, @TagData, @ParentID);
        
        SELECT SCOPE_IDENTITY() AS NewID, 'Inserted' AS Status;
    END
    ELSE
    BEGIN
        -- If TagID exists, we perform an UPDATE
        UPDATE [dbo].[Tags]
        SET TreeID = @TreeID,
            TagName = @TagName,
            TagData = @TagData,
            ParentID = @ParentID
        WHERE TagID = @TagID;

        IF @@ROWCOUNT = 0
            SELECT @TagID AS ID, 'Not Found' AS Status;
        ELSE
            SELECT @TagID AS ID, 'Updated' AS Status;
    END
END
GO
