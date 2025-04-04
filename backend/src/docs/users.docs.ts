/**
 * @openapi
 * /users/ldap:
 *   get:
 *     summary: Get users from LDAP
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users from LDAP
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   name:
 *                     type: string
 *       401:
 *         description: Unauthorized - insufficient permissions
 */
